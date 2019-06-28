Vue.use(VueVirtualScroller);
Vue.component('virtual-scroller', VueVirtualScroller.VirtualScroller);

function measureScroll() {

  //creates a DOM element
  const testDiv = document.createElement('div');

  //stores the CSS atributes
  const cssAttributes = {
    width: '100px',
    height: '100px',
    overflow: 'scroll',
    position: 'absolute',
    top: '-999px'
  };


  //sets all the styles on testDiv
  for (let attr in cssAttributes) {
    testDiv.style[attr] = cssAttributes[attr];
  }

  //adds the testDiv to the DOM
  document.body.appendChild(testDiv);

  //measures the the scrollWidth
  const width = testDiv.offsetWidth - testDiv.clientWidth;

  //removes the testDiv from the DOM
  document.body.removeChild(testDiv);

  //returns the width
  return width;
}

const hexToRgb = hex => {
  const int = parseInt(hex.replace('#', ''), 16);
  return {
    r: int >> 16 & 255,
    g: int >> 8 & 255,
    b: int & 255
  };

};

const app = new Vue({
  el: '#app',
  data: () => ({
    colors: [{
      hex: '#ffffff',
      rgb: { r: 255, g: 255, b: 255 },
      name: `Loading lots of colors`
    }],

    scrollWidth: measureScroll(),
    similarsLength: 60,
    filterString: '',
    title: 'Title',
    hex: '#f00f00',
    showDetail: false,
    timer: null,
    colorList: [{
      hex: '#ffffff',
      rgb: { r: 255, g: 255, b: 255 },
      name: `Loading lots of colors`
    }],

    pickedColor: '#ffffff'
  }),

  computed: {
    bg: function () {
      return this.isDark(hexToRgb(this.pickedColor)) ? '#fff' : '#212121';
    }
  },

  methods: {
    filterColor: function (e) {
      const colval = hexToRgb(e.target.value);
      this.filterString = e.target.value;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let i = 0;
        const similarColors = [];

        while (i < this.similarsLength) {
          similarColors.push(
            this.colors[
            this.closestColors.get([colval.r, colval.g, colval.b]).index]);


          i++;
        }

        this.colorList = similarColors;
        this.closestColors.clearCache();
      }, 100);
    },

    filterColorName: function (e) {
      this.pickedColor = '#ffffff';
      const name = e.target.value.toLowerCase();

      const colors = this.colors.filter(col => {
        return col.name.toLowerCase().indexOf(name) > -1 || col.hex.indexOf(name) > -1;
      });

      this.colorList = colors.length ? colors : [{
        hex: '#f0c',
        rgb: {
          r: 255,
          g: 255,
          b: 255
        },

        name: `${this.colors.length} colors and you can't find any!`
      }];


    },

    showLarge: function ($event, color) {
      this.showDetail = !this.showDetail;

      this.title = color.name;
      this.hex = color.hex;
      const rect = $event.target.getBoundingClientRect();

      this.$refs.bg.style.transition = 'none';
      this.$refs.bg.style.top = rect.top + 'px';
      this.$refs.bg.style.height = rect.height + 'px';

      this.$refs.bg.style['background-color'] = color.hex;

      setTimeout(() => {

        this.$refs.bg.style.transition = `
        477ms top cubic-bezier(.2,.4,.2,1.2), 
        477ms left cubic-bezier(.2,.4,.2,1.2), 
        477ms height cubic-bezier(.2,.4,.2,1.2), 
        477ms width cubic-bezier(.2,.4,.2,1.2)
      `;
        setTimeout(() => {
          this.$refs.bg.style.top = 0;
          this.$refs.bg.style.left = 0;
          this.$refs.bg.style.height = window.innerHeight + 'px';
          this.$refs.bg.style.width = window.innerWidth + 'px';
        }, 10);
      }, 10);
    },
    isDark: rgb => Math.round(

      (
        parseInt(rgb.r) * 299 +
        parseInt(rgb.g) * 587 +
        parseInt(rgb.b) * 114) /
      1000) <

      125
  }
});



const xhr = new XMLHttpRequest();
xhr.open('GET', '//color-names.herokuapp.com/v1/');
xhr.onload = e => {
  if (xhr.status === 200) {
    let resp = JSON.parse(xhr.responseText);
    app.colors = resp.colors /*.sort((a,b) => ( a.luminance - b.luminance )).reverse()*/;
    app.closestColors = new Closest(resp.colors.map(c => [c.rgb.r, c.rgb.g, c.rgb.b]), true);

    app.colorList = [...app.colors];

  } else {
    console.log(xhr.status);
  }
};
xhr.send();