import m, { FactoryComponent }  from 'mithril'
import L from 'leaflet';
import 'leaflet-draw';
import { IActions, IAppModel } from '../../services';

export const Leaflet: FactoryComponent<{
    state: IAppModel;
    actions: IActions;
}> = () => {
    return {
        view: () => {
            return m('.row', [
                m(`div`, {
                    id: "leafletMap",
                    style: `position: absolute; top: 64px; height: ${window.innerHeight}; left: 0px; width: ${window.innerWidth};`
                })
            ])
        },
        oncreate: ({attrs: { state, actions } }) => {        
            const { app } = state;
            
            // Set socket listeners
            app.socket?.removeAllListeners();
            app.socket?.on('positions', (data) => {
                console.log(data)
            })
            
            // Set tile layers
            const mb = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ', {
                id: 'mb', tileSize: 256, attribution: 'mapboxAttribution'
            })
            const hr = L.tileLayer('https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey=931nNYHFAJN7xzv38O3wmat3R0fZ8XEVMFp9iiYb6Xs&ppi=320', {
                id: 'here', tileSize: 256, attribution: 'mapboxAttribution'
            })
            const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                id: 'osm', tileSize: 256, attribution: 'mapboxAttribution'
            })

            // Create map
            const lmap = L.map('leafletMap', {
                center: [51.9, 4.48],
                zoom: 10,
                layers: [mb, osm, hr]
            });

            const baseMaps = {
                "<span style='color: gray'>Here</span>": hr,
                "<span style='color: gray'>OSM</span>": osm,
                "<span style='color: gray'>MB</span>": mb
            };

            L.control.layers(baseMaps).addTo(lmap)

            // Draw code
            let drawLayer = new L.FeatureGroup();
            lmap.addLayer(drawLayer);

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawLayer
                }
            });
            lmap.addControl(drawControl);

            lmap.on(L.Draw.Event.CREATED, function (e) {
                let layer = e.layer;
                drawLayer.addLayer(layer);
            });
        }
    }
}