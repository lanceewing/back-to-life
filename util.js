let $ = {};

/** 
 * @namespace Holds utility functions.
 */
$.Util = {};

/**
 * Draws a filled circle of the given diameter. The fill style should have already
 * been set before invoking this function. This is used for drawing spheres and 
 * the eyes on the spheres.
 *
 * @param {Object} ctx The 2D canvas context to draw the filled circle on.
 * @param {number} x The x position of the filled circle.
 * @param {number} y The y position of the filled circle.
 * @param {number} d The diameter of the filled circle.
 */
$.Util.fillCircle = function(ctx, x, y, d, angle, drawBorder) {
  var r = d / 2;
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, 0, angle * Math.PI);
  ctx.closePath();
  ctx.fill();
  if (drawBorder) ctx.stroke();
};

/**
 * Utility function for obtaining a 2D canvas from a newly created canvas of the 
 * given width and height.
 *  
 * @param {number} w The width of the canvas.
 * @param {number} h The height of the canvas.
 */
$.Util.create2dContext = function(w, h) {
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h || w;
  return (canvas.getContext('2d'));
};

/**
 * Draws a person background sprite image. This includes the four different directions,
 * and three different cycles of moving in that direction. The parameters allow different
 * size persons to be drawn, of different clours, and with different features.
 */
$.Util.renderPerson = function(w, h, direction, c, face, clothes, hat, pack, line) {
  var ctx = $.Util.create2dContext(w, h + (w / 10));

  var ballSize = (w / 5);
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  if (line) {
    ctx.strokeStyle = line;
  }
  
  // Hat ball on top
  if (hat) {
    ctx.fillStyle = hat;
    $.Util.fillCircle(ctx, (w / 2) - (ballSize / 2), 0, ballSize, 2, true);
  }
  
  // Head & hat
  var headSize = w - (w / 5);
  var headStart = ballSize - (ballSize / 5);
  ctx.fillStyle = hat;
  $.Util.fillCircle(ctx, 0 + ((w - headSize) / 2), headStart, headSize, 2, true);
  ctx.fillStyle = face;
  $.Util.fillCircle(ctx, 0 + ((w - headSize) / 2), headStart, headSize, hat? 1 : 2, true);
  
  // Neck
  var bodyStart = headStart + headSize;
  var packStart = bodyStart + (w / 10);
  
  // Backpack
  var packWidth = (w / 2.75);
  if (pack) {
    ctx.fillStyle = pack;
    ctx.beginPath();
    if (direction != 0) {
      ctx.rect(w / 2, packStart, -packWidth, headSize);
    }
    if (direction != 1) {
      ctx.rect(w / 2, packStart, packWidth, headSize);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // Body
  var bodyBottom = bodyStart + w + (w / 1.5);
  var shoulderWidth = w / 6;
  ctx.fillStyle = clothes;
  ctx.beginPath();
  ctx.moveTo(w / 2, bodyStart);
  ctx.lineTo((w / 2) - shoulderWidth, bodyStart);
  if (direction != 1) {
    // Draw left point
    ctx.lineTo(3, bodyBottom);
  }
  ctx.lineTo((w / 2) - shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) + shoulderWidth, bodyBottom);
  if (direction != 0) {
    // Draw right point
    ctx.lineTo(w - 3, bodyBottom);
  }
  ctx.lineTo((w / 2) + shoulderWidth, bodyStart);
  ctx.lineTo(w / 2, bodyStart);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  if (pack) {
    if (direction == 2) {
      ctx.fillStyle = pack;
      ctx.beginPath();
      ctx.rect((w / 2) - packWidth, packStart, packWidth * 2, headSize);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  
  // Legs
  var legLength = h - bodyBottom;
  var legFactors = [1, 1, 0.5];
  var leftFactor = legFactors[c];
  var rightFactor = legFactors[(c + 1) % 3];
  
  ctx.beginPath();
  ctx.moveTo((w / 2) - shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) - shoulderWidth, bodyBottom + legLength * leftFactor);
  ctx.moveTo((w / 2) + shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) + shoulderWidth, bodyBottom + legLength * rightFactor);
  ctx.closePath();
  ctx.stroke();
  
  return ctx.canvas;
};
