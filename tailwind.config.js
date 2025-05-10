/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  darkMode: ["class"],
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
  extend: {
    spacing: {
      '128': '32rem',
      '144': '36rem'
    },
    maxWidth: {
      custom: '1200px'
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
  keyframes: {
    "infinity-scroll":{
      "0%": {
        transform: "translateX(0)"
      },
      "100%": {
        transform: "translateX(-30%)"
      },
    },
    'scroll-marquee': {
      to : {
        left: '-100px',
      },
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }, 
      },
    'scroll-track': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }, 
    },
    'scroll-left': {
      to: {
        left: '-200px'
      },
    },
  },
  animation: {
    "infinity-scroll": "infinity-scroll 5s linear infinite",
    'scroll-marquee': 'scroll-marquee 10s linear infinite',
    'scroll-track': 'scroll-track 10s linear infinite',
    'scroll-left': 'scroll-left 10s linear infinite',
  },
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      }
    },
=======
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		spacing: {
  			'128': '32rem',
  			'144': '36rem'
  		},
  		maxWidth: {
  			custom: '1200px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			"infinity-scroll":{
				"0%": {
					transform: "translateX(0)"
				},
				"100%": {
					transform: "translateX(-30%)"
				},
			},
			'scroll-marquee': {
				to : {
					left: '-100px',
				},
      			'0%': { transform: 'translateX(0%)' },
      			'100%': { transform: 'translateX(-100%)' }, 
    		},
			'scroll-track': {
        		'0%': { transform: 'translateX(0)' },
        		'100%': { transform: 'translateX(-100%)' }, 
			},
			'scroll-left': {
				to: {
					left: '-200px'
				},
			},
		},
		animation: {
			"infinity-scroll": "infinity-scroll 5s linear infinite",
			'scroll-marquee': 'scroll-marquee 10s linear infinite',
			'scroll-track': 'scroll-track 10s linear infinite',
			'scroll-left': 'scroll-left 10s linear infinite',
		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
	}
	
  },
  plugins: [require("tailwindcss-animate")],
>>>>>>> quoc
}

},
plugins: [require("tailwindcss-animate")],
}
