const CropImageByBorder = {
  get4Points_: function (o, r, borderColor) {
    const colors = r.map(({ c }) => c);
    const left = colors.indexOf(borderColor);
    const right = colors.lastIndexOf(borderColor);
    if (Object.values(o).every((e) => e == 0) && left != -1 && right != -1) {
      o.lx = r[left].x;
      o.ly = r[left].y;
      o.rx = r[right].x;
      o.ry = r[right].y;
      return true;
    }
    return false;
  },

  getCoordinates_: function (ctx, width, height, borderColor) {
    const self = this;
    const ar = [];
    for (var y = 0; y < height; y++) {
      const temp = [];
      for (var x = 0; x < width; x++) {
        const { data } = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = data;
        const cc = ((r << 16) | (g << 8) | b).toString(16);
        const c = "#" + (!isNaN(cc) ? String(cc).padStart(6, "0") : cc);
        temp.push({ x, y, c });
      }
      ar.push(temp);
    }
    const [top, end] = [...Array(2)].map((_) => {
      const o = { lx: 0, ly: 0, rx: 0, ry: 0 };
      for (let i = 0; i < ar.length; i++)
        if (self.get4Points_(o, ar[i], borderColor)) break;
      ar.reverse();
      return o;
    });
    if ([top, end].every((e) => Object.values(e).every((f) => f == 0))) {
      throw new Error(
        "There is no border for cropping image. Please confirm the border, again"
      );
    }
    return { top, end };
  },

  getInnerImage: function ({ base64Data, borderColor, offset }) {
    return new Promise((resolve, reject) => {
      try {
        const self = this;
        offset = offset || 1;
        const cvs = document.createElement("canvas");
        const ctx = cvs.getContext("2d");
        const img = new Image();
        img.src = base64Data;
        img.onload = function () {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          cvs.width = width;
          cvs.height = height;
          ctx.drawImage(img, 0, 0);
          const { top, end } = self.getCoordinates_(
            ctx,
            width,
            height,
            borderColor
          );
          const newWidth = top.rx - top.lx - offset;
          const newHeight = end.ly - top.ly - offset;
          cvs.width = newWidth;
          cvs.height = newHeight;
          ctx.clearRect(0, 0, newWidth, newHeight);
          ctx.drawImage(
            img,
            top.lx + offset,
            top.ly + offset,
            newWidth,
            newHeight,
            0,
            0,
            newWidth,
            newHeight
          );
          const base64 = cvs.toDataURL("image/png");
          resolve(base64);
        };
      } catch (e) {
        reject(e);
      }
    });
  },
};
