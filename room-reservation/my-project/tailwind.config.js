/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif']
      },
      colors: {
        'actText': '#422D01',
        'notActText': '#816A3C',
        'backColor' : '#fcf8f0', 
        'mainCol' : '#efd19b', 
        'mainBorder' : '#bfa77c', 
        'cirlce' : '#bfa77c', 
        'hoverCirlce' : '#a18d68', 
        'darkText' : '#4a4130', 
        'actNav': '#CCB27D',
        'processDiv': '#E1EBFF',
        'bordColor': '#CCB27D',
        'mainBg': '#FFF5E1',
      },
    },
  },
  plugins: [
    function ({addUtilities}){
      const newUtilities = {
        ".scrollbarthin" : {
          scrollbarWidth : "thin",
          scrollbarColor : "rgb(31 29 29) white"
        },
        ".scrollbar-webkit" : {
          "&::-webkit-scrollbar" : {
            width : "8px"
          },
          "&::-webkit-scrollbar-track" : {
            background : "white"
          },
          "&::-webkit-scrollbar-thumb" : {
            backgroundColor : "rgb(31 41 55)",
            borderRadius : "20px",
            border : "1px solid white"
          }
        }
      }

      addUtilities(newUtilities, ["responsive", "hover"])
    }
  ],
}