String.prototype.maxLen = function (len) {
    var txt = this;
    if (txt.length > len)
        txt = txt.slice(0, len)
    return txt
}
