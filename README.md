## Sample-Markdown
A ~130 line Javascript implementation of Markdown.  
Adding features and porting to React, Vue, etc, has been considered.

**This code is not written for production, this is a sample.**

[**Interactive demo**](https://ucld.github.io/Sample-Markdown/extra/demo.html)

### Supported features

* Headers (only # prefixed)

* **Bold** and *Italics*

* [Links (Images optional)](https://example.com)

* Dot points/Lists

### Bugs
* Custom list values are not supported.
 * One space should only nest once.
* There are only ordered and unordered lists.
1. The last list type takes precedence.

Links, have higher priority than bolding, italics & images.  
Therefore, **[this](url)**, should not work but [**this**](url) should.

Priority may be broken occasionally, but it is not intended or supported.