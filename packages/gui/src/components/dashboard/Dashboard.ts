import m from 'mithril'
import { LeafletMap } from 'mithril-leaflet';

const baseLayers = {
    OSM: {
        url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
            minZoom: 3,
            maxZoom: 20,
            attribution:
                '©OpenStreetMap Contributors. Tiles courtesy of Humanitarian OpenStreetMap Team',
        }
    }
};

export const Dashboard = () => ({
    view: () => {
        return m('.row', [
            m(
                'ul#slide-out.sidenav.sidenav-fixed',
                {
                    style: `height: ${window.innerHeight - 30}px; 
                        width: 300px`,
                    oncreate: ({ dom }) => {
                        M.Sidenav.init(dom);
                    },
                },
                m('p', 'sidenav contents')
            ),
            m('.contentarea', m(LeafletMap, {
                style: `position: absolute; top: 64px; height: ${window.innerHeight - 64
                    }; left: ${window.innerWidth > 992 ? 300 : 0}px; width: ${window.innerWidth > 992 ? `${window.innerWidth - 300}px` : '100%'
                    };`,
                view: [51.9, 4.48],
                zoom: 10,
                // mapOptions: { crs: crsRD },
                baseLayers,
                maxZoom: 20,
                //overlays,
                visible: ['sources', 'clouds'],
                editable: ['sources'],
                showScale: { imperial: false },
                // onLoadedOverlaysChanged: (v: string[]) => (state.visible = v),
            }))
        ])
    }
})