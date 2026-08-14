figma.showUI(__html__, {
  width: 900,
  height: 620,
  title: "Shader Flow"
});

// --- Helpers ---

function uint8ArrayToBase64(bytes) {
  var binary = "";
  var chunkSize = 8192;
  for (var i = 0; i < bytes.length; i += chunkSize) {
    var chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

function detectMime(bytes) {
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes[8] === 0x57 && bytes[9] === 0x45) return "image/webp";
  return "image/png";
}

// Safe dimension extraction for any node type (VectorNode, BooleanOperationNode, etc.)
function getNodeDimensions(node) {
  if (typeof node.width === "number" && typeof node.height === "number" && node.width > 0 && node.height > 0) {
    return { width: Math.round(node.width), height: Math.round(node.height) };
  }
  if (node.absoluteBoundingBox && typeof node.absoluteBoundingBox.width === "number") {
    return {
      width: Math.max(1, Math.round(node.absoluteBoundingBox.width)),
      height: Math.max(1, Math.round(node.absoluteBoundingBox.height))
    };
  }
  return { width: 512, height: 512 };
}

// --- Load image from selected layer ---

async function loadImageFromSelection() {
  var sel = figma.currentPage.selection;

  if (!sel || sel.length === 0) {
    figma.ui.postMessage({ type: "selectionInfo", hasImage: false, hasNode: false });
    return;
  }

  var node = sel[0];
  var dims = getNodeDimensions(node);

  var imageFill = null;
  if (Array.isArray(node.fills) && node.fills.length > 0) {
    for (var j = 0; j < node.fills.length; j++) {
      if (node.fills[j].type === "IMAGE") {
        imageFill = node.fills[j];
        break;
      }
    }
  }

  if (!imageFill) {
    figma.ui.postMessage({
      type: "selectionInfo",
      hasImage: false,
      hasNode: true,
      nodeId: node.id,
      nodeName: node.name,
      nodeWidth: dims.width,
      nodeHeight: dims.height
    });
    return;
  }

  try {
    var image = figma.getImageByHash(imageFill.imageHash);
    if (!image) throw new Error("Image not found");
    var bytes = await image.getBytesAsync();
    if (!bytes || bytes.length === 0) throw new Error("Empty image bytes");

    var base64 = uint8ArrayToBase64(bytes);
    var mime = detectMime(bytes);

    figma.ui.postMessage({
      type: "selectionInfo",
      hasImage: true,
      hasNode: true,
      nodeId: node.id,
      nodeName: node.name,
      nodeWidth: dims.width,
      nodeHeight: dims.height,
      imageBase64: base64,
      imageMime: mime
    });
  } catch (err) {
    figma.ui.postMessage({
      type: "selectionInfo",
      hasImage: false,
      hasNode: true,
      nodeId: node.id,
      nodeName: node.name,
      nodeWidth: dims.width,
      nodeHeight: dims.height,
      error: String(err.message || err)
    });
  }
}

// --- Apply result (Replace / Add) ---

async function applyImage(nodeId, base64, method) {
  var node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    figma.ui.postMessage({ type: "applyError", message: "Layer not found" });
    return;
  }

  try {
    var binaryStr = atob(base64);
    var bytes = new Uint8Array(binaryStr.length);
    for (var i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    var newImage = figma.createImage(bytes);

    var fills = Array.isArray(node.fills) ? node.fills.slice() : [];
    var newFill = { type: "IMAGE", imageHash: newImage.hash, scaleMode: "FILL" };

    if (method === "replace") {
      var replaced = false;
      for (var j = fills.length - 1; j >= 0; j--) {
        if (fills[j].type === "IMAGE" && fills[j].visible !== false) {
          var f = Object.assign({}, fills[j]);
          f.imageHash = newImage.hash;
          fills[j] = f;
          replaced = true;
          break;
        }
      }
      if (!replaced) fills.push(newFill);
    } else if (method === "add") {
      fills.push(newFill);
    }

    node.fills = fills;
    figma.ui.postMessage({ type: "applySuccess" });
  } catch (err) {
    figma.ui.postMessage({ type: "applyError", message: String(err) });
  }
}

function resizeWindow(w, h) {
  figma.ui.resize(w, h);
}

// --- Messages from UI ---

figma.ui.onmessage = async function(msg) {
  if (msg.type === "requestImage") {
    await loadImageFromSelection();
  } else if (msg.type === "applyImage") {
    figma.ui.postMessage({ type: "applying" });
    await applyImage(msg.nodeId, msg.base64, msg.method);
  } else if (msg.type === "resize") {
    resizeWindow(msg.width, msg.height);
  } else if (msg.type === "save-library-data") {
    await figma.clientStorage.setAsync("shader_library_cached_data", msg.data);
  } else if (msg.type === "get-cached-library") {
    var cachedData = await figma.clientStorage.getAsync("shader_library_cached_data");
    if (cachedData) {
      figma.ui.postMessage({ type: "restore-library-data", data: cachedData });
    }
  } else if (msg.type === "save-ui-scale") {
    await figma.clientStorage.setAsync("shaderflow_ui_scale", msg.scale);
  } else if (msg.type === "get-ui-scale") {
    var savedScale = await figma.clientStorage.getAsync("shaderflow_ui_scale");
    if (savedScale) {
      figma.ui.postMessage({ type: "restore-ui-scale", scale: savedScale });
    }
  }
};

// --- Selection events ---

figma.on("selectionchange", function() {
  loadImageFromSelection();
});

// --- Start ---

loadImageFromSelection();