import m, { FactoryComponent } from 'mithril'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { MapboxStyleDefinition, MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import { IActions, IAppModel } from '../../services';
import bbox from '@turf/bbox'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export const Mapbox: FactoryComponent<{
    state: IAppModel;
    actions: IActions;
}> = () => {
    return {
        view: () => {
            return m('.row', [
                m(`div`, {
                    id: "mapboxMap",
                    style: `position: absolute; top: 64px; height: ${window.innerHeight - 64}; left: 0px; width: ${window.innerWidth};`
                })
            ])
        },
        oncreate: ({ attrs: { state, actions } }) => {
            const { app } = state;

            // Create map
            mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ'
            const map = new mapboxgl.Map({
                container: 'mapboxMap',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [4.48, 51.9],
                zoom: 9
            });

            // Define styles (layers)
            const styles: MapboxStyleDefinition[] = [
                {
                    title: 'Mapbox',
                    uri: 'mapbox://styles/mapbox/streets-v11'
                },
                {
                    title: 'Here',
                    uri: 'https://assets.vector.hereapi.com/styles/berlin/base/mapbox/tilezen?apikey=931nNYHFAJN7xzv38O3wmat3R0fZ8XEVMFp9iiYb6Xs'
                }
            ];

            // Add nav control
            map.addControl(new mapboxgl.NavigationControl());

            // Add switch control
            map.addControl(new MapboxStyleSwitcherControl(styles, 'Mapbox'))

            // Add draw control
            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                }
            });
            map.addControl(draw);


            // Application code (after map loads)
            map.on('load', () => {
                // Set socket listeners
                app.socket?.removeAllListeners();
                app.socket?.on('positions', (data) => {
                    // if no source, add it and its layer, else update source's data
                    if (!map.getSource('positions')) {
                        map.addSource('positions', {
                            type: 'geojson',
                            data: data
                        })

                        map.addLayer({
                            'id': 'geojson_fr',
                            'type': 'circle',
                            'source': 'positions',
                            'paint': {
                                'circle-radius': 6,
                                'circle-color': '#B42222'
                            },
                            'filter': ['==', '$type', 'Point']
                        });
                    }
                    else {
                        map.getSource('positions').setData(data);
                    }
                });

                // On creation of polygon
                map.on('draw.create', (e) => {
                    if (map.getLayer('geojson_fr')) {
                        const bounding = bbox(e.features[0])
                        let bboxFeatures = map.queryRenderedFeatures([map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])], { layers: ['geojson_fr'] });
                        const polyFeatures = bboxFeatures.filter((element) => {
                            return booleanPointInPolygon([element.geometry.coordinates[0], element.geometry.coordinates[1]], e.features[0])
                        });
                        console.log(polyFeatures)
                    }
                });

                // On update of polygon
                map.on('draw.update', (e) => {
                    if (map.getLayer('geojson_fr')) {
                        const bounding = bbox(e.features[0])
                        let bboxFeatures = map.queryRenderedFeatures([map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])], { layers: ['geojson_fr'] });
                        const polyFeatures = bboxFeatures.filter((element) => {
                            return booleanPointInPolygon([element.geometry.coordinates[0], element.geometry.coordinates[1]], e.features[0])
                        });
                        console.log(polyFeatures)
                    }
                })

                // Popup on click on geojson_fr layer
                map.on('click', 'geojson_fr', function (e) {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const props = e.features[0].properties
                    const description = `<strong>${props.type}</strong><p>${props.tags + props.id}</p>`;

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(map);
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'geojson_fr', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'geojson_fr', function () {
                    map.getCanvas().style.cursor = '';
                });
            })
        }
    }
}