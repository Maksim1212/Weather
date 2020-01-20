const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const PORT = '8888';

const apiKey = 'c3e58021321d178c2b55d2533301f39b';

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
                let weatherText = `It's id ${data.city.id} 
                 ${data.list[0].weather[0].icon}
                  ${data.list[5].weather[0].description}
                  ${new Date(data.list[0].dt * 1000)}
                `;
                res.render('index', { weather: weatherText, error: null });

            }
        }
    });
})

app.listen(PORT, function() {
    console.log('Weather app listening on port 8888')
})