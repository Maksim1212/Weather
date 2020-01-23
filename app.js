const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const PORT = '8888';
const apiKey = 'c3e58021321d178c2b55d2533301f39b';
const imageUri = 'https://openweathermap.org/img/wn/';
const imageFormat = '@2x.png';
let weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('index.ejs', { weather: null, error: null });
})

app.post('/', function(req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}
    &units=imperial&appid=${apiKey}`

    request(url, function(err, response, body) {

        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let data = JSON.parse(body)
            if (data == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                const unikDays = {};
                for (let i = 0; i < data.list.length; i++) {
                    const date = new Date(data.list[i].dt_txt);
                    if (!unikDays[date.getDate()]) {
                        unikDays[date.getDate()] = data.list[i];
                    }
                }
                let dayKeys = Object.keys(unikDays);

                for (let k = 0; k < dayKeys.length; k++) {
                    let numberDay = `${new Date(unikDays[dayKeys[k]].dt * 1000).getDay()}`;
                    dayName = weekday[numberDay];
                    weatherImage = `${imageUri}${unikDays[dayKeys[k]].weather[0].icon}${imageFormat}`;

                    console.log(dayName);
                    console.log(weatherImage);
                }

                // let weatherText = `It's id ${data.name} 
                //  ${data.list[1].weather[0].icon}
                //   ${(new Date(data.list[0].dt * 1000)).getDay()}`;

                //let numberDay = `${(new Date(data.list[0].dt * 1000)).getDay()}`;
                //let dayName = weekday[numberDay];
                res.render('index', { weather: weatherText, error: null });
                //res.send('')
            }
        }
    });
})

app.listen(PORT, function() {
    console.log('Weather app listening on port 8888')
})