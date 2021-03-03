import m, { FactoryComponent } from 'mithril'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { MapboxStyleDefinition, MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import { IActions, IAppModel } from '../../services';

export const Mapbox: FactoryComponent<{
    state: IAppModel;
    actions: IActions;
}> = () => {
    return {
        view: () => {
            return m('.row', [
                m(`div`, {
                    id: "mapboxMap",
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

            // Add switcher
            map.addControl(new MapboxStyleSwitcherControl(styles, 'Mapbox'))

            // Draw code
            const draw = new MapboxDraw({
                displayControlsDefault: true
            });
            map.addControl(draw);
        }
    }
}