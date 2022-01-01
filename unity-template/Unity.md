# Unity WebGL templates

Via. https://docs.unity3d.com/Manual/webgl-templates.html

## Template variables, macros, and conditional directives

During the build process, Unity pre-processes template files and evaluates all macros and conditional directives included in those files. As part of this process, Unity finds and replaces all macro declarations with the values the Editor supplies. Unity automatically pre-processes all .html, .php, .css, .js and .json files in the template folder.

### Internal preprocessor variables

The following internal preprocessor variables refer to data in the Project, and Unity assigns value to them at build time according to the values the Editor supplies. Javascript macros and conditional directives can use these internal preprocessor variables.

| **Variable**           | **Type** | **Description**                                              |
| :--------------------- | :------- | :----------------------------------------------------------- |
| COMPANY_NAME           | String   | The Company Name defined in the Player Settings.             |
| PRODUCT_NAME           | String   | The Product Name defined in the Player Settings.             |
| PRODUCT_VERSION        | String   | The Version defined in the Player Settings.                  |
| WIDTH                  | Integer  | The Default Canvas Width defined in the Player Settings > Resolution and Presentation. |
| HEIGHT                 | Integer  | The Default Canvas Height in the Player Settings > Resolution and Presentation. |
| SPLASH_SCREEN_STYLE    | String   | This is set to the “Dark” value when Splash Style Player Settings > Splash Image is set to Light on Dark, otherwise it is set to the “Light” value. |
| BACKGROUND_COLOR       | String   | Represents the Background Color defined in a form of a hex triplet. |
| UNITY_VERSION          | String   | The Unity version.                                           |
| DEVELOPMENT_PLAYER     | Boolean  | This is set to true if the **Development Build**  option is enabled. |
| DECOMPRESSION_FALLBACK | String   | This is set to “Gzip” or “Brotli”, depending on which **compression**  method is used and which decompressor is included in the build. If neither is included, the variable is set to an empty string. |
| TOTAL_MEMORY           | Integer  | The initial size of the memory heap in bytes.                |
| USE_WASM               | Boolean  | This is set to true if the current build is a WebAssembly build. |
| USE_THREADS            | Boolean  | This is set to true if the current build uses threads.       |
| USE_WEBGL_1_0          | Boolean  | This is set to true if the current build supports the WebGL1.0 graphics API. |
| USE_WEBGL_2_0          | Boolean  | This is set to true if the current build supports the WebGL2.0 graphics API. |
| USE_DATA_CACHING       | Boolean  | This is set to true if the current build uses indexedDB caching for the downloaded files. |
| LOADER_FILENAME        | String   | This is set to the filename of the build loader script.      |
| DATA_FILENAME          | String   | This is set to the filename of the main data file.           |
| FRAMEWORK_FILENAME     | String   | This is set to the filename of the build framework script.   |
| CODE_FILENAME          | String   | This is set to the filename of the WebAssembly module when the current build is a WebAssembly build, otherwise it is set to the filename of the `asm.js` module. |
| MEMORY_FILENAME        | String   | This is set to the filename of the memory file when memory is stored in an external file, otherwise it is set to an empty string. |
| SYMBOLS_FILENAME       | String   | This is set to the filename of the JSON file containing debug symbols when the current build is using debug symbols, otherwise it is set to an empty string. |
| BACKGROUND_FILENAME    | String   | This is set to the filename of the background image when the background image is selected in the Player Settings > Splash Image, otherwise it is set to an empty string. |

## Instantiation : createUnityInstance()

The `createUnityInstance()` function creates a new instance of your content. You can use it like this: 
```js
createUnityInstance(canvas, config, onProgress)
  .then(onSuccess)
  .catch(onError)
```

This function returns a Promise object, where:

| Object                           | Use                                                          |
| :------------------------------- | :----------------------------------------------------------- |
| `canvas`                         | Unity runtime uses the `canvas` object to render the game.   |
| `config`                         | The `config` object contains the build configuration, such as the code and data URLs, product and company name, and version. For more information on config definition, see the [Build Configuration](https://docs.unity3d.com/Manual/webgl-templates.html#build_configuration) section on this page. |
| `onProgress(progress) {...}`     | The WebGL loader calls the `onProgress` callback object every time the download progress updates. The `progress` argument that comes with the `onProgress` callback determines the loading progress as a value between 0.0 and 1.0. |
| `onSuccess(unityInstance) {...}` | The `onSuccess` callback is called after the build has successfully instantiated. The created Unity instance object is provided as an argument. This object can be used for interaction with the build. |
| `onError(message) {...}`         | The onError callback is called if an error occurs during build instantiation. An error message is provided as an argument. |



## Build configuration

The configuration object contains the build configuration, which consists of code and data URLs, product name, company name, and version. You can define it using the following code:

```js
var buildUrl = "Build";
var config = {
  dataUrl: buildUrl + "/{{{ DATA_FILENAME }}}",
  frameworkUrl: buildUrl + "/{{{ FRAMEWORK_FILENAME }}}",
  codeUrl: buildUrl + "/{{{ CODE_FILENAME }}}",
#if MEMORY_FILENAME
  memoryUrl: buildUrl + "/{{{ MEMORY_FILENAME }}}",
#endif
#if SYMBOLS_FILENAME
  symbolsUrl: buildUrl + "/{{{ SYMBOLS_FILENAME }}}",
#endif
  streamingAssetsUrl: "StreamingAssets",
  companyName: "{{{ COMPANY_NAME }}}",
  productName: "{{{ PRODUCT_NAME }}}",
  productVersion: "{{{ PRODUCT_VERSION }}}",
};
```

The `Build` folder contains the following files (`[ExampleBuild]` represents the name of the target build folder):

| File name                     | Contains                                                     |
| :---------------------------- | :----------------------------------------------------------- |
| `[ExampleBuild].loader.js`    | The JavaScript code that the web page needs in order to load the Unity content. |
| `[ExampleBuild].framework.js` | JavaScript runtime and plugins.                              |
| `[ExampleBuild].wasm`         | WebAssembly binary.                                          |
| `[ExampleBuild].mem`          | A binary image to initialize the heap memory for your Player. Unity only generates this file for multi-threaded WebAssembly builds. |
| `[ExampleBuild].data`         | Asset data and **Scenes** .                                  |
| `[ExampleBuild].symbols.json` | Debug symbol names necessary to demangle an error stack trace. This file is only generated for Release builds when you enable the Debug Symbols option (**File** > **Build Settings** > **Player Settings**.) |
| `[ExampleBuild].jpg`          | A background image, which displays while the build is loading. This file is only generated when a Background Image is provided in the Player Settings (**File** > **Build Settings** > **Player Settings** > **Splash Image**). See the Splash Screen page for further information. |




## Build interaction

After the build has successfully instantiated, the fulfilment handler callback of the Promise object receives the newly created Unity instance object as an argument. To interact with the build, call the following methods of the Unity instance:

| Method                                                     | Use                                                          |
| :--------------------------------------------------------- | :----------------------------------------------------------- |
| `unityInstance.SetFullscreen(fullscreen)`                  | The `SetFullscreen` method toggles full screen mode. This method does not return a value. - Full screen mode is activated when the `fullscreen` argument has a value of 1. *Full screen mode is disabled when the `fullscreen` argument has a value of 0. |
| `unityInstance.SendMessage(objectName, methodName, value)` | The SendMessage method sends messages to the GameObjects. This method does not return a value. - **objectName** is the name of an object in your Scene. - **methodName** is the name of a method in the script, currently attached to that object. - **value** can be a string, a number, or it can be empty. |
| `unityInstance.Quit().then(onQuit)`                        | The `Quit()` method can be used to quit the runtime and clean up the memory used by the Unity instance. This method returns a Promise object. - **onQuit** callback is called after the build runtime has quit. |

