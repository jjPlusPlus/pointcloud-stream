# PointCloud Stream demonstration

## Prerequisites for the demo machine
* node
* NPM
* global npm live-server package  

## Running the project
* In the /server directory, run `node app.js`  
* In the /client directory, run: `live-server`  

## API
1. __/sendPoints__: request will be a JSON array of point objects, each having an x, y, z, and color attribute. The positional xyz attributes are float3's & the color attribute is a string in the format of "rgb(255,255,255)"  
2. __/setFloor__: request will be a JSON "floor" attribute with a float-precision value- this is the Y position of the floor plane  
3. __/transferImages:__ request will be a large ZIP file of images to be streamed to the client for download & import to MatLab.  

The app will run on http://127.0.0.1:8080/
