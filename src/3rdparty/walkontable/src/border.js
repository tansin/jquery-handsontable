function WalkontableBorder(instance, settings) {
  var style;

  //reference to instance
  this.instance = instance;
  this.settings = settings;
  this.wtDom = this.instance.wtDom;

  this.main = document.createElement("div");
  style = this.main.style;
  style.position = 'absolute';
  style.top = 0;
  style.left = 0;

  for (var i = 0; i < 5; i++) {
    var DIV = document.createElement('DIV');
    DIV.className = 'wtBorder ' + (settings.className || '');
    style = DIV.style;
    style.backgroundColor = settings.border.color;
    style.height = settings.border.width + 'px';
    style.width = settings.border.width + 'px';
    this.main.appendChild(DIV);
  }

  this.top = this.main.childNodes[0];
  this.left = this.main.childNodes[1];
  this.bottom = this.main.childNodes[2];
  this.right = this.main.childNodes[3];

  this.topStyle = this.top.style;
  this.leftStyle = this.left.style;
  this.bottomStyle = this.bottom.style;
  this.rightStyle = this.right.style;

  this.corner = this.main.childNodes[4];
  this.corner.className += ' corner';
  this.cornerStyle = this.corner.style;
  this.cornerStyle.width = '5px';
  this.cornerStyle.height = '5px';
  this.cornerStyle.border = '2px solid #FFF';

  this.disappear();
  instance.wtTable.hider.appendChild(this.main);
}

/**
 * Show border around one or many cells
 * @param {Array} corners
 */
WalkontableBorder.prototype.appear = function (corners) {
  var isMultiple, $from, $to, fromOffset, toOffset, containerOffset, top, minTop, left, minLeft, height, width;
  if (this.disabled) {
    return;
  }

  var instance = this.instance
    , offsetRow = instance.getSetting('offsetRow')
    , offsetColumn = instance.getSetting('offsetColumn')
    , lastRow = instance.wtTable.getLastVisibleRow()
    , lastColumn = instance.wtTable.getLastVisibleColumn();

  var hideTop = false, hideLeft = false, hideBottom = false, hideRight = false;

  if (!walkontableRangesIntersect(corners[0], corners[2], offsetRow, lastRow)) {
    hideTop = hideLeft = hideBottom = hideRight = true;
  }
  else {
    if (corners[0] < offsetRow) {
      corners[0] = offsetRow;
      hideTop = true;
    }
    if (corners[2] > lastRow) {
      corners[2] = lastRow;
      hideBottom = true;
    }
  }

  if (!walkontableRangesIntersect(corners[1], corners[3], offsetColumn, lastColumn)) {
    hideTop = hideLeft = hideBottom = hideRight = true;
  }
  else {
    if (corners[1] < offsetColumn) {
      corners[1] = offsetColumn;
      hideLeft = true;
    }
    if (corners[3] > lastColumn) {
      corners[3] = lastColumn;
      hideRight = true;
    }
  }

  if (hideTop + hideLeft + hideBottom + hideRight < 4) { //at least one border is not hidden
    isMultiple = (corners[0] !== corners[2] || corners[1] !== corners[3]);
    $from = $(instance.wtTable.getCell([corners[0], corners[1]]));
    $to = isMultiple ? $(instance.wtTable.getCell([corners[2], corners[3]])) : $from;
    fromOffset = this.wtDom.offset($from[0]);
    toOffset = isMultiple ? this.wtDom.offset($to[0]) : fromOffset;
    containerOffset = this.wtDom.offset(instance.wtTable.TABLE);

    minTop = fromOffset.top;
    height = toOffset.top + $to.outerHeight() - minTop;
    minLeft = fromOffset.left;
    width = toOffset.left + $to.outerWidth() - minLeft;

    top = minTop - containerOffset.top - 1;
    left = minLeft - containerOffset.left - 1;

    if (parseInt($from.css('border-top-width'), 10) > 0) {
      top += 1;
      height -= 1;
    }
    if (parseInt($from.css('border-left-width'), 10) > 0) {
      left += 1;
      width -= 1;
    }
  }

  if (hideTop) {
    this.topStyle.display = 'none';
  }
  else {
    this.topStyle.top = top + 'px';
    this.topStyle.left = left + 'px';
    this.topStyle.width = width + 'px';
    this.topStyle.display = 'block';
  }

  if (hideLeft) {
    this.leftStyle.display = 'none';
  }
  else {
    this.leftStyle.top = top + 'px';
    this.leftStyle.left = left + 'px';
    this.leftStyle.height = height + 'px';
    this.leftStyle.display = 'block';
  }

  var delta = Math.floor(this.settings.border.width / 2);

  if (hideBottom) {
    this.bottomStyle.display = 'none';
  }
  else {
    this.bottomStyle.top = top + height - delta + 'px';
    this.bottomStyle.left = left + 'px';
    this.bottomStyle.width = width + 'px';
    this.bottomStyle.display = 'block';
  }

  if (hideRight) {
    this.rightStyle.display = 'none';
  }
  else {
    this.rightStyle.top = top + 'px';
    this.rightStyle.left = left + width - delta + 'px';
    this.rightStyle.height = height + 1 + 'px';
    this.rightStyle.display = 'block';
  }

  if (hideBottom && hideRight || !this.hasSetting(this.settings.border.cornerVisible)) {
    this.cornerStyle.display = 'none';
  }
  else {
    this.cornerStyle.top = top + height - 4 + 'px';
    this.cornerStyle.left = left + width - 4 + 'px';
    this.cornerStyle.display = 'block';
  }
};

/**
 * Hide border
 */
WalkontableBorder.prototype.disappear = function () {
  this.topStyle.display = 'none';
  this.leftStyle.display = 'none';
  this.bottomStyle.display = 'none';
  this.rightStyle.display = 'none';
  this.cornerStyle.display = 'none';
};

WalkontableBorder.prototype.hasSetting = function (setting) {
  if (typeof setting === 'function') {
    return setting();
  }
  return !!setting;
};