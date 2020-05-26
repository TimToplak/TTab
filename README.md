# TTab

Custom new tab override. On top it shows quote of the day, on left it shows stock price history. On top right, weather and on bottom right random Wikipedia article.

## Installation

Extension is not yet publishet to Google extension store or Firefox one. Only way to install it is through source code.

1.  Download source code as ZIP and extract it
2.  Open **/dist/tab/config.example.json** and add your API keys for [OpenWeather](https://openweathermap.org/) and [AlphaVantage](https://www.alphavantage.co/), and stock symbols of stocks you wish to be displayed.
3.  Rename **config.example.json** to **config.json**

#### Google chrome

4.  copy: **chrome://extensions/** and paste it in search bar
5.  enable developer mode

    ![](https://raw.githubusercontent.com/TimToplak/KeyTabber/master/assetsREADME/developerModeGoogleChrome.jpg)

6.  click button **Load unpacked** and select **/dist** folder
    ![](https://raw.githubusercontent.com/TimToplak/KeyTabber/master/assetsREADME/loadUnpacked.jpg)

#### Firefox

4.  copy: **about:debugging#addons** and paste it in search bar
5.  click button **Load Temporary Add-on...** and go to **/dist** folder
    ![](https://raw.githubusercontent.com/TimToplak/KeyTabber/master/assetsREADME/loadTemporaryAddOn.jpg)
6.  select **manifest.json** file

## Demo

![](https://i.imgur.com/kMI06AD.png)

### License

MIT
