## CHANGELOG ##

---

### Version 1.4.0 ###

Version 1.4 implements a number of changes and improvements. Most of them are just internal issues. But there are some other changes as well. See details below:

+ **New property <code>content</code>** of the jsPanel representing all DOM within the content area of the jsPanel.

+ For **childpanels** (meaning jsPanels that are appended to the content area of another jsPanel) dragging is limited to the containing element by default. This can be overruled using the draggable configuration object.

+ improved functionality of the events **onjspanelloaded** and **onjspanelclosed** including a bugfix: **onjspanelclosed** was fired twice in certain situations.

+ Some more code is now put in functions for better reusability and to avoid code repetitions.

+ internal improvements in the options: **autoclose, id, modal, rtl, tooltip**

+ internal improvements in the methods: **close(), closeChildpanels(), maximize(), storeData()**

---

### Version 1.3.0 ###

+ **New option.rtl** adds support for RTL text direction on individual jsPanels

+ **Bugfix in option.modal** when a modal jsPanel is appended directly to the <body> element

+ internal improvements in the code base

---

### Version 1.2.1 ###

Maintanance realease. No changes in the API, just internal code improvements

---

### Version 1.2.0 ###

+ new **option.tooltip** implements a basic tooltip functionality. Tooltips can be positioned either top, right, left or bottom of the element the tooltip is applied to and offers almost all options a normal jsPanel has.

+ **jsPanel.css** integrates some css rules that provide the possibility to generate text only tooltips using only css3

See the [API](http://jspanel.de/bootstrap/api.html) for more details

---

### Version 1.1.1 ###

+ changed **option.toolbarFooter**: footer will be removed when not used instead of display:none

+ some internal adaptions

---

### Version 1.1.0 ###

+ added **option.header** allows to remove the header section of a jsPanel completely giving the panel a lot more flexibility.

---