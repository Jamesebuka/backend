var QRCode = require('qrcode')

function to_data_url(data) {
    QRCode.toDataURL(data, function (err, url) {
        console.log(url)
    })       
}

function qr_to_string(data) {
    QRCode.toString(data,{type:'terminal'}, function (err, url) {
        console.log(url)
    })    
}

// With promises
function generate_with_promise(data) {
    QRCode.toDataURL(data)
  .then(url => {
    console.log(url)
  })
  .catch(err => {
    console.error(err)
  })
}

// With async/await

const generateQR = async (data) => {
    try {
      console.log(await QRCode.toDataURL(data))
    } catch (err) {
      console.error(err)
    }
}


qr_to_string("My name is lucifer")