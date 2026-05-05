/**
 * @file export_annual_burned_area_by_lulc_mapbiomas_c4.js
 * @description
 * Computes annual burned area (km²) by land use and land cover (LULC)
 * classes for the Cerrado biome using MapBiomas Fire Collection 4.
 *
 * Outputs:
 * - CSV table exported to Google Drive
 *
 * Dataset:
 * - MapBiomas Fire Collection 4 (30 m)
 *
 * Author: Vera Arruda
 * Repository: burned-area-cerrado
 */

// ==============================
// PARAMETERS
// ==============================

// Years to process
var YEARS = ee.List.sequence(1985, 2024);

// Study area (Cerrado biome)
var CERRADO = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas-2019')
  .filter(ee.Filter.eq('Bioma', 'Cerrado'));
var GEOMETRY = CERRADO.geometry().bounds();

// MapBiomas Fire dataset
var MAPBIOMAS_FIRE = ee.Image(
  'projects/mapbiomas-public/assets/brazil/fire/collection4_1/mapbiomas_fire_collection41_annual_burned_coverage_v1'
);

// Export settings
var EXPORT_FOLDER = 'cerrado-fire-analysis';
var EXPORT_NAME = 'annual_burned_area_lulc_mapbiomas_c4';
var SCALE = 30;

// Pixel area in km²
var PIXEL_AREA = ee.Image.pixelArea().divide(1e6);

// ==============================
// LEGENDS
// ==============================

var legends = require('users/geomapeamentoipam/MapBiomas__Fogo:00_Tools/Legends.js');

var LULC_LEVEL_0 = ee.Dictionary(legends.get('lulc_mbc10_nivel_0_eng'));
var LULC_LEVEL_1 = ee.Dictionary(legends.get('lulc_mbc10_nivel_1_eng'));
var LULC_LEVEL_1_1 = ee.Dictionary(legends.get('lulc_mbc10_nivel_1_1_eng'));

// ==============================
// FUNCTIONS
// ==============================

/**
 * Computes burned area per LULC class for a given image.
 */
function computeBurnedAreaByClass(image, geometry) {

  var reducer = ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class'
  });

  var stats = PIXEL_AREA.addBands(image).reduceRegion({
    reducer: reducer,
    geometry: geometry,
    scale: SCALE,
    maxPixels: 1e12
  });

  var groups = ee.List(stats.get('groups'));

  var features = groups.map(function(item) {
    item = ee.Dictionary(item);

    var classId = ee.Number(item.get('class')).int();

    return ee.Feature(null, {
      'year': null, // will be set later
      'biome': 'Cerrado',
      'dataset': 'MapBiomas Fire Collection 4',

      'area_km2': item.get('sum'),
      'class_id': classId,

      'lulc_level_0': LULC_LEVEL_0.get(classId),
      'lulc_level_1': LULC_LEVEL_1.get(classId),
      'lulc_level_1_1': LULC_LEVEL_1_1.get(classId)
    });
  });

  return ee.FeatureCollection(features);
}

// ==============================
// MAIN PROCESS
// ==============================

var results = ee.FeatureCollection(
  YEARS.map(function(year) {

    var bandName = ee.String('burned_coverage_').cat(ee.Number(year).format());

    var image = MAPBIOMAS_FIRE.select(bandName);

    var yearlyStats = computeBurnedAreaByClass(image, GEOMETRY);

    yearlyStats = yearlyStats.map(function(feature) {
      return feature.set('year', year);
    });

    return yearlyStats;

  })
).flatten();

// ==============================
// EXPORT
// ==============================

Export.table.toDrive({
  collection: results,
  description: EXPORT_NAME,
  folder: EXPORT_FOLDER,
  fileNamePrefix: EXPORT_NAME,
  fileFormat: 'CSV'
});
