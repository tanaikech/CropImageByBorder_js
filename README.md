# Javascript Library for Cropping Image by Border

<a name="top"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

# Overview

This is a Javascript library for cropping images by the border.

<a name="description"></a>

# Description

When an image is used, there is a case where I wanted to simply crop the image by a script. In this Javascript library, the image is cropped by a border. The sample situation is as follows.

![](https://tanaikech.github.io/image-storage/20220809a/fig1.png)

In this sample situation, a red rectangle is enclosed by a border (1 pixel) with "#000000". By this border, this library crops the red rectangle. In this case, the 1-pixel border is not included in the resulting image.

<a name="install"></a>

# Install

```html
<script src="cropImageByBorder_js.min.js"></script>
```

Or, using jsdelivr cdn

```html
<script src="https://cdn.jsdelivr.net/gh/tanaikech/CropImageByBorder_js@master/cropImageByBorder_js.min.js"></script>
```

# Usage

This library is used for cropping the image by the border. The simple sample script is as follows.

```html
<script src="https://cdn.jsdelivr.net/gh/tanaikech/CropImageByBorder_js/cropImageByBorder_js.min.js"></script>

<body>
  <input type="file" accept="image/png" onchange="main(this)" />
</body>

<script>
  function main(e) {
    const filename = "sample.png";
    const file = e.files[0];
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = async (f) => {
      const obj = { borderColor: "#000000", base64Data: f.target.result };
      const base64 = await CropImageByBorder.getInnerImage(obj).catch((err) =>
        console.log(err)
      );
      const link = document.createElement("a");
      link.download = filename;
      link.href = base64;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      delete link;
    };
  }
</script>
```

When this HTML is opened, you can see the file input tag. When you put a sample PNG file including a border of "#000000", the cropped image is returned.

## Options

In the current version, the method of `getInnerImage` has 1 argument like `CropImageByBorder.getInnerImage(obj)`. The cropping is done using **Canvas API**. [Ref](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

- `obj` : This is an object including the border color and data.

  - `borderColor`: Border color. This library crops the image using this border. Please set the color as the HEX like `#000000`.
  - `base64Data`: In this case, the data is required to be base64 data including the header like `data:image/png;base64,` for PNG.
  - `offset`: If the result image shows the border, please adjust this value. The default value is `1` pixel.

- Returned value: Promise is returned. And, in this library, the output image is returned as base64 data including the header of `data:image/png;base64,`. The default output mimeType is `image/png`.

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (August 9, 2022)

  1. Initial release.

- v1.0.1 (August 10, 2022)

  1. `offset` is added.

[TOP](#top)
