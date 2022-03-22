const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				gray: {
					'50': '#fafafa',
					'100': '#f1f1f1',
					'200': '#dbdbdb',
					'300': '#bbbbbb',
					'400': '#959595',
					'500': '#757575',
					'600': '#5e5e5e',
					'700': '#484848',
					'800': '#323232',
					'900': '#1f1f1f',
				},
				cerise: {
					'50': '#fff6f6',
					'100': '#ffefef',
					'200': '#f9d3d3',
					'300': '#eaa6a6',
					'400': '#e56d6d',
					'500': '#d93c3e',
					'600': '#bd0e0f',
					'700': '#930705',
					'800': '#680605',
					'900': '#470201',
				},
				orange: {
					'50': '#fff8f1',
					'100': '#fbecdf',
					'200': '#f6d7bf',
					'300': '#e5ad8b',
					'400': '#d67a4a',
					'500': '#c4540b',
					'600': '#9c4303',
					'700': '#713707',
					'800': '#4a2702',
					'900': '#2c1b01',
				},
				lemon: {
					'50': '#fdfdea',
					'100': '#fdf6be',
					'200': '#f5e27b',
					'300': '#d9bd2f',
					'400': '#b6930d',
					'500': '#967100',
					'600': '#805501',
					'700': '#643e02',
					'800': '#422a00',
					'900': '#271a00',
				},
				green: {
					'50': '#f3faf7',
					'100': '#daf5eb',
					'200': '#b6e5d3',
					'300': '#85c8ac',
					'400': '#3ca773',
					'500': '#108835',
					'600': '#016d00',
					'700': '#005301',
					'800': '#003906',
					'900': '#072408',
				},
				leaf: {
					'50': '#edfafa',
					'100': '#d5f5f6',
					'200': '#aae7ea',
					'300': '#69c8ce',
					'400': '#13a2ad',
					'500': '#0d828d',
					'600': '#056874',
					'700': '#06505c',
					'800': '#043744',
					'900': '#01222f',
				},
				azure: {
					'50': '#f4faff',
					'100': '#e2f0ff',
					'200': '#c4defe',
					'300': '#95bbee',
					'400': '#5e95e4',
					'500': '#2173e6',
					'600': '#1358cc',
					'700': '#1242a2',
					'800': '#1a2e6c',
					'900': '#161d38',
				},
				blue: {
					'50': '#f5f8ff',
					'100': '#e5edff',
					'200': '#ccdafc',
					'300': '#a5b8e9',
					'400': '#7c91e1',
					'500': '#5c69e9',
					'600': '#4a46e1',
					'700': '#3a31b9',
					'800': '#282284',
					'900': '#191452',
				},
				indigo: {
					'50': '#faf9ff',
					'100': '#f1effe',
					'200': '#dcd7fc',
					'300': '#bcb2f2',
					'400': '#9e86e5',
					'500': '#895ddb',
					'600': '#8335c8',
					'700': '#6620a9',
					'800': '#48147b',
					'900': '#2f0d4d',
				},
				cerise: {
					'50': '#fff5fb',
					'100': '#fdeaf5',
					'200': '#fbd2e9',
					'300': '#e9a7cc',
					'400': '#de6ea8',
					'500': '#d53485',
					'600': '#b90263',
					'700': '#90084c',
					'800': '#5e1734',
					'900': '#301820',
				},

			}
		},
		transitionDuration: {
			DEFAULT: '210ms'
		},
		transitionTimingFunction: {
			DEFAULT: 'cubic-bezier(.44,.1,.66,1)'
		},
		fontFamily: {
			sans: ['"Work Sans"', 'sans-serif']
		}
	},

	plugins: [
		// require('@tailwindcss/forms')
	]
};

module.exports = config;
