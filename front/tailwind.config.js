module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    height: {
      xl: '55px',
      footer: '5%',
      header: '15%',
      body: '80%',
      screen: '100vh',
      caroussel: '400px',
      middle: '50%',
      full: '100%',
      big_nft: '710px',
    },
    width: {
      button: '250px',
      search_bar: '640px',
      full: '100%',
      profile: '55px',
      icon: '20px',
      big_nft: '515px',
    },
    fontSize: {
      xs: '10px',
      small: '15px',
      medium: '20px',
      large: '25px',
      title: '30px',
      big: '40px',
      xl: '50px',
    },
    borderRadius: {
    }, 
    colors: {
      black: "#000000",
      grey: '#808080',
      light_grey: '#D5D5D5',
      green: '#27C937',
      light_blue: '#27C9C9',
      white: "#FFFFFF",
    },
    fontFamily: {
      'all': ['Roboto'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
