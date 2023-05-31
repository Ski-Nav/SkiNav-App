To make the mapview of this app work, you need a valid mapbox API key.

The only purpose of mapbox is to actually draw directed arrows on the map. This app can very much not use MapBox, but for some reason since drawing arrows on a normal react native MapView is somehow one of the hardest things ever done in the react native community, we're opting to go with MapBox just for this scenario. We still save money by shifting our architecture to not rely on MapBox otherwise.

In this folder, `credentials`, put a `mapbox.json` file with the format contained in the `mapbox-example.json` file.

