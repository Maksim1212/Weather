const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = '8888';
const apiKey = 'c3e58021321d178c2b55d2533301f39b';
const imageUri = 'https://openweathermap.org/img/wn/';
const imageFormat = '@2x.png';
const weekday = new Array(7);
weekday[0] = 'Sun';
weekday[1] = 'Mon';
weekday[2] = 'Tue';
weekday[3] = 'Wed';
weekday[4] = 'Thu';
weekday[5] = 'Fri';
weekday[6] = 'Sat';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index.ejs', { weather: null, error: null });
});

app.post('/', function(req, res) {
    const { city } = req.body;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}
    &units=imperial&appid=${apiKey}`

    request(url, function(err, response, body) {

        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            const data = JSON.parse(body) // parse JSON data
            if (data === undefined || data.cod !== '200') {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                const unikDays = {}; // object with sorted days
                for (let i = 0; i < data.list.length; i++) {
                    const date = new Date(data.list[i].dt_txt);
                    if (!unikDays[date.getDate()]) {
                        unikDays[date.getDate()] = data.list[i] // sorted days
                    }
                }

                const dayKeys = Object.keys(unikDays);
                const dayNameObj = {};
                const weatherImageObj = {};
                for (let k = 0; k < dayKeys.length; k++) {
                    const numberDay = `${new Date(unikDays[dayKeys[k]].dt * 1000).getDay()}`; // get the day number from unix format
                    dayNameObj[k] = weekday[numberDay]; // give the numbers of the day names
                    weatherImageObj[k] = `${imageUri}${unikDays[dayKeys[k]].weather[0].icon}${imageFormat}`; // form the address of the picture
                }

                const dayName = Object.values(dayNameObj); // take values from the object with the names of the days
                const weatherImage = Object.values(weatherImageObj); // take values from the object with the images uri

                console.log(dayName); // log result day name 
                console.log(weatherImage); // log image address

                res.render('index', { weather: dayName, weatherImage, error: null }); // send data to view
            }
        }
    });
});

app.listen(PORT, function() {
    console.log('Weather app listening on port 8888')
})