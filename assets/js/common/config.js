export default function baseConfig() {
  return {
    anims: {
      live: {
        interval: 60000,
        getProgress: (now) => {
          const time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
          return time / 86400
        }
      }
    },
    base_coordinates: {
      lat: 43.949317,
      long: 4.805528
    },
    date: (time) => {
      return time ? new Date(time) : new Date()
    },
    // date: () => new Date('2023-04-22 11:01:00'),
    horizon: (height) => {
      // Récupération des infos de la page
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const heightRatio = Math.round(windowHeight / windowWidth)
      // Setup des dimensions des layers
      let layerWidth = windowHeight * 2
      let layerHeight = windowHeight
      if (layerWidth > 2000) {
        layerWidth = 2000
        layerHeight = 1000
      }
      if (heightRatio >= 1) {
        layerWidth = windowWidth
        layerHeight = windowWidth / 2
      }
      return height || layerHeight / 3
    },
    states: [
      {
        name: 'nadir',
        colors_palette: {
          0: '#000B14', // Sky
          1: '#7da5d5', // Clouds
          2: '#3078bf', // Moutains
          3: '#1860a5', // Trees first layer
          4: '#155798', // Trees second layer
          5: '#0c4e8f', // Field first layer
          6: '#073866', // Field second layer
          7: '#042b50', // Field third layer
          8: '#02213f', // Grass first layer
          9: '#021a32', // Grass second layer
          10: '#00101f', // Grass third layer
          11: '#114B86', // Trees first layer front
          12: '#0E487F', // Trees first layer back
          13: '#00437A', // Trees second layer front
          14: '#003866', // Trees second layer back
          15: '#06325B', // Trees third layer front
          16: '#052D53', // Trees third layer back
          17: '#032648', // Trees fourth layer front
          18: '#032341', // Trees fourth layer back
          19: '#000B14', // House front
          20: '#000203', // House side
          21: '#FFBF8B', // House windows
          22: '#032341' // House roof
        }
      },
      {
        name: 'nightEnd',
        colors_palette: {
          0: '#7B787D', // Sky
          1: '#BEBDD5', // Clouds
          2: '#869BCC', // Moutains
          3: '#7087BF', // Trees first layer
          4: '#637BB2', // Trees second layer
          5: '#5872AA', // Field first layer
          6: '#426092', // Field second layer
          7: '#344E7D', // Field third layer
          8: '#2C3D63', // Grass first layer
          9: '#212F4B', // Grass second layer
          10: '#171E2F', // Grass third layer
          11: '#5E73A7', // Trees first layer front
          12: '#536EA2', // Trees first layer back
          13: '#49699E', // Trees second layer front
          14: '#425E8F', // Trees second layer back
          15: '#3B5887', // Trees third layer front
          16: '#374F7B', // Trees third layer back
          17: '#2B4068', // Trees fourth layer front
          18: '#26395B', // Trees fourth layer back
          19: '#7B787D', // House front
          20: '#6D6566', // House side
          21: '#CAAE95', // House windows
          22: '#737281' // House roof
        }
      },
      {
        name: 'nauticalDawn',
        colors_palette: {
          0: '#f5e5e5', // Sky
          1: '#fed4d5', // Clouds
          2: '#dcbed9', // Moutains
          3: '#c8aed9', // Trees first layer
          4: '#b19fcc', // Trees second layer
          5: '#a496c4', // Field first layer
          6: '#7d88bd', // Field second layer
          7: '#6371a9', // Field third layer
          8: '#555986', // Grass first layer
          9: '#404364', // Grass second layer
          10: '#2e2c3f', // Grass third layer
          11: '#AB9BC8', // Trees first layer front
          12: '#9794C5', // Trees first layer back
          13: '#918FC1', // Trees second layer front
          14: '#8484B7', // Trees second layer back
          15: '#707DB3', // Trees third layer front
          16: '#6971A2', // Trees third layer back
          17: '#525A87', // Trees fourth layer front
          18: '#494F74', // Trees fourth layer back
          19: '#f5e5e5', // House front
          20: '#D9C8C8', // House side
          21: '#959C9E', // House windows
          22: '#E3C0C1' // House roof
        }
      },
      {
        name: 'dawn',
        colors_palette: {
          0: '#f5e5e5', // Sky
          1: '#fed4d5', // Clouds
          2: '#dcbed9', // Moutains
          3: '#c8aed9', // Trees first layer
          4: '#b19fcc', // Trees second layer
          5: '#a496c4', // Field first layer
          6: '#7d88bd', // Field second layer
          7: '#6371a9', // Field third layer
          8: '#555986', // Grass first layer
          9: '#404364', // Grass second layer
          10: '#2e2c3f', // Grass third layer
          11: '#AB9BC8', // Trees first layer front
          12: '#9794C5', // Trees first layer back
          13: '#918FC1', // Trees second layer front
          14: '#8484B7', // Trees second layer back
          15: '#707DB3', // Trees third layer front
          16: '#6971A2', // Trees third layer back
          17: '#525A87', // Trees fourth layer front
          18: '#494F74', // Trees fourth layer back
          19: '#f5e5e5', // House front
          20: '#D9C8C8', // House side
          21: '#959C9E', // House windows
          22: '#E3C0C1' // House roof
        }
      },
      {
        name: 'sunrise',
        colors_palette: {
          0: '#f5e5e5', // Sky
          1: '#fed4d5', // Clouds
          2: '#dcbed9', // Moutains
          3: '#c8aed9', // Trees first layer
          4: '#b19fcc', // Trees second layer
          5: '#a496c4', // Field first layer
          6: '#7d88bd', // Field second layer
          7: '#6371a9', // Field third layer
          8: '#555986', // Grass first layer
          9: '#404364', // Grass second layer
          10: '#2e2c3f', // Grass third layer
          11: '#AB9BC8', // Trees first layer front
          12: '#9794C5', // Trees first layer back
          13: '#918FC1', // Trees second layer front
          14: '#8484B7', // Trees second layer back
          15: '#707DB3', // Trees third layer front
          16: '#6971A2', // Trees third layer back
          17: '#525A87', // Trees fourth layer front
          18: '#494F74', // Trees fourth layer back
          19: '#f5e5e5', // House front
          20: '#D9C8C8', // House side
          21: '#959C9E', // House windows
          22: '#E3C0C1' // House roof
        }
      },
      {
        name: 'sunriseEnd',
        colors_palette: {
          0: '#E6EDF2', // Sky
          1: '#FFE9EA', // Clouds
          2: '#E0C6CA', // Moutains
          3: '#E4A69D', // Trees first layer
          4: '#D8978C', // Trees second layer
          5: '#D08C7F', // Field first layer
          6: '#B76C77', // Field second layer
          7: '#9B5372', // Field third layer
          8: '#70355E', // Grass first layer
          9: '#51274E', // Grass second layer
          10: '#382A43', // Grass third layer
          11: '#D59286', // Trees first layer front
          12: '#C88282', // Trees first layer back
          13: '#C47C7B', // Trees second layer front
          14: '#A46778', // Trees second layer back
          15: '#975773', // Trees third layer front
          16: '#82496E', // Trees third layer back
          17: '#813F60', // Trees fourth layer front
          18: '#653951', // Trees fourth layer back
          19: '#FAF2F2', // House front
          20: '#D8D0D0', // House side
          21: '#7E9AA2', // House windows
          22: '#CA9783' // House roof
        }
      },
      {
        name: 'goldenHourEnd',
        colors_palette: {
          0: '#E6EDF2', // Sky
          1: '#FFE9EA', // Clouds
          2: '#E0C6CA', // Moutains
          3: '#E4A69D', // Trees first layer
          4: '#D8978C', // Trees second layer
          5: '#D08C7F', // Field first layer
          6: '#B76C77', // Field second layer
          7: '#9B5372', // Field third layer
          8: '#70355E', // Grass first layer
          9: '#51274E', // Grass second layer
          10: '#382A43', // Grass third layer
          11: '#D59286', // Trees first layer front
          12: '#C88282', // Trees first layer back
          13: '#C47C7B', // Trees second layer front
          14: '#A46778', // Trees second layer back
          15: '#975773', // Trees third layer front
          16: '#82496E', // Trees third layer back
          17: '#813F60', // Trees fourth layer front
          18: '#653951', // Trees fourth layer back
          19: '#FAF2F2', // House front
          20: '#D8D0D0', // House side
          21: '#7E9AA2', // House windows
          22: '#CA9783' // House roof
        }
      },
      {
        name: 'solarNoon',
        colors_palette: {
          0: '#D7F4FF', // Sky
          1: '#FFFEFE', // Clouds
          2: '#E3CDBA', // Moutain
          3: '#ff9d60', // Trees first layer
          4: '#ff8f4c', // Trees second layer
          5: '#fc813a', // Field first layer
          6: '#f04f30', // Field second layer
          7: '#d2353a', // Field third layer
          8: '#8b1036', // Grass first layer
          9: '#620a38', // Grass second layer
          10: '#2f1121', // Grass third layer
          11: '#FE8843', // Trees first layer front
          12: '#F86F3E', // Trees first layer back
          13: '#F66835', // Trees second layer front
          14: '#C44938', // Trees second layer back
          15: '#BE3033', // Trees third layer front
          16: '#9A2039', // Trees third layer back
          17: '#AF2338', // Trees fourth layer front
          18: '#81232E', // Trees fourth layer back
          19: '#ffffff', // House front
          20: '#D7D7D7', // House side
          21: '#6798A5', // House windows
          22: '#b16e44' // House roof
        }
      },
      {
        name: 'goldenHour',
        colors_palette: {
          0: '#EBDCA4', // Sky
          1: '#FFD69C', // Clouds
          2: '#EBB467', // Moutains
          3: '#F6953A', // Trees first layer
          4: '#E47F2F', // Trees second layer
          5: '#EF7E29', // Field first layer
          6: '#D85125', // Field second layer
          7: '#C13E29', // Field third layer
          8: '#7E1928', // Grass first layer
          9: '#4F0B23', // Grass second layer
          10: '#270911', // Grass third layer
          11: '#D57514', // Trees first layer front
          12: '#C46116', // Trees first layer back
          13: '#E46827', // Trees second layer front
          14: '#D85E29', // Trees second layer back
          15: '#AB3527', // Trees third layer front
          16: '#942E24', // Trees third layer back
          17: '#671226', // Trees fourth layer front
          18: '#641D3A', // Trees fourth layer back
          19: '#FFD69C', // House front
          20: '#EBC288', // House side
          21: '#959C9E', // House windows
          22: '#D3813C' // House roof
        }
      },
      {
        name: 'sunsetStart',
        colors_palette: {
          0: '#ffc348', // Sky
          1: '#ffad39', // Clouds
          2: '#f49333', // Moutains
          3: '#ed8d14', // Trees first layer
          4: '#c86f11', // Trees second layer
          5: '#e17b17', // Field first layer
          6: '#c0531a', // Field second layer
          7: '#b04717', // Field third layer
          8: '#70211a', // Grass first layer
          9: '#3c0b0e', // Grass second layer
          10: '#1e0000', // Grass third layer
          11: '#A46D34', // Trees first layer front
          12: '#975B31', // Trees first layer back
          13: '#A95F39', // Bushes front // Trees second layer front
          14: '#A15737', // Trees second layer back
          15: '#853B31', // Trees third layer front
          16: '#72312E', // Trees third layer back
          17: '#59202C', // Trees fourth layer front
          18: '#512232', // Trees fourth layer back
          19: '#ffc348', // House front
          20: '#DEB768', // House side
          21: '#8D8D8D', // House windows
          22: '#f49333' // House roof
        }
      },
      {
        name: 'sunset',
        colors_palette: {
          0: '#ffc348', // Sky
          1: '#ffad39', // Clouds
          2: '#f49333', // Moutains
          3: '#ed8d14', // Trees first layer
          4: '#c86f11', // Trees second layer
          5: '#e17b17', // Field first layer
          6: '#c0531a', // Field second layer
          7: '#b04717', // Field third layer
          8: '#70211a', // Grass first layer
          9: '#3c0b0e', // Grass second layer
          10: '#1e0000', // Grass third layer
          11: '#A46D34', // Trees first layer front
          12: '#975B31', // Trees first layer back
          13: '#A95F39', // Bushes front // Trees second layer front
          14: '#A15737', // Trees second layer back
          15: '#853B31', // Trees third layer front
          16: '#72312E', // Trees third layer back
          17: '#59202C', // Trees fourth layer front
          18: '#512232', // Trees fourth layer back
          19: '#ffc348', // House front
          20: '#DEB768', // House side
          21: '#8D8D8D', // House windows
          22: '#f49333' // House roof
        }
      },
      {
        name: 'dusk',
        colors_palette: {
          0: '#80672E', // Sky
          1: '#BEA987', // Clouds
          2: '#928679', // Moutains
          3: '#83775D', // Trees first layer
          4: '#6F6355', // Trees second layer
          5: '#776553', // Field first layer
          6: '#644640', // Field second layer
          7: '#5A3934', // Field third layer
          8: '#39212D', // Grass first layer
          9: '#1F1320', // Grass second layer
          10: '#0F0810', // Grass third layer
          11: '#736454', // Trees first layer front
          12: '#6A554B', // Trees first layer back
          13: '#6E564A', // Trees second layer front
          14: '#694F44', // Trees second layer back
          15: '#5F403A', // Trees third layer front
          16: '#4F3437', // Trees third layer back
          17: '#4A2D31', // Trees fourth layer front
          18: '#3D262A', // Trees fourth layer back
          19: '#80672E', // House front
          20: '#6F5D36', // House side
          21: '#FFBF8B', // House windows
          22: '#7C5B3A' // House roof
        }
      },
      {
        name: 'nauticalDusk',
        colors_palette: {
          0: '#80672E', // Sky
          1: '#BEA987', // Clouds
          2: '#928679', // Moutains
          3: '#83775D', // Trees first layer
          4: '#6F6355', // Trees second layer
          5: '#776553', // Field first layer
          6: '#644640', // Field second layer
          7: '#5A3934', // Field third layer
          8: '#39212D', // Grass first layer
          9: '#1F1320', // Grass second layer
          10: '#0F0810', // Grass third layer
          11: '#736454', // Trees first layer front
          12: '#6A554B', // Trees first layer back
          13: '#6E564A', // Trees second layer front
          14: '#694F44', // Trees second layer back
          15: '#5F403A', // Trees third layer front
          16: '#4F3437', // Trees third layer back
          17: '#4A2D31', // Trees fourth layer front
          18: '#3D262A', // Trees fourth layer back
          19: '#80672E', // House front
          20: '#6F5D36', // House side
          21: '#FFBF8B', // House windows
          22: '#7C5B3A' // House roof
        }
      },
      {
        name: 'night',
        colors_palette: {
          0: '#000B14', // Sky
          1: '#7da5d5', // Clouds
          2: '#3078bf', // Moutains
          3: '#1860a5', // Trees first layer
          4: '#155798', // Trees second layer
          5: '#0c4e8f', // Field first layer
          6: '#073866', // Field second layer
          7: '#042b50', // Field third layer
          8: '#02213f', // Grass first layer
          9: '#021a32', // Grass second layer
          10: '#00101f', // Grass third layer
          11: '#114B86', // Trees first layer front
          12: '#0E487F', // Trees first layer back
          13: '#00437A', // Trees second layer front
          14: '#003866', // Trees second layer back
          15: '#06325B', // Trees third layer front
          16: '#052D53', // Trees third layer back
          17: '#032648', // Trees fourth layer front
          18: '#032341', // Trees fourth layer back
          19: '#000B14', // House front
          20: '#000203', // House side
          21: '#FFBF8B', // House windows
          22: '#032341' // House roof
        }
      }
    ]
  }
}
