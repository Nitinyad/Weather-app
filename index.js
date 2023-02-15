const http = require('http')

const requests = require('requests')
const fs = require('fs')

const homeFile = fs.readFileSync('home.html' , 'utf-8')


const replaceVal = (tempVal , orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}" , Math.floor((orgVal.main.temp-273)*100)/100);
    temperature = temperature.replace("{%tempmin%}" , Math.floor((orgVal.main.temp_min -273)*100)/100);
    temperature = temperature.replace("{%tempmax%}" , Math.floor((orgVal.main.temp_max -273)*100)/100);
    temperature = temperature.replace("{%location%}" , orgVal.name);
    temperature = temperature.replace("{%country%}" , orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}" , orgVal.weather[0].main)
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url=='/'){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar,OD,IND&appid=28cb81269713006861d9f719d3feff26"
        ).on("data" , function(chunk){
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            // const tempData = Math.floor((arrData[0].main.temp - 273)*100)/100;
            // console.log(tempData)
            const realTimeData = arrData.map((val)=>{
                return replaceVal(homeFile,val);
            }).join("")
            res.write(realTimeData)
            // console.log(realTimeData)
        })
        .on("end" , function(err){
            if(err) return console.log("connection closed due to error" , err)
            console.log("end");
            res.end()
        })
    }
})

server.listen(8000,  '127.0.0.1')