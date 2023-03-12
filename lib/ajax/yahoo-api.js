const REQUEST_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch';
const CLIENT_ID = `${process.env.CLIENT_ID}`;
const fetch = require('node-fetch');

var localSearch;
var deserialize;

localSearch = async (query, addressCode, output, needsImage) => {
  try {
    const url = REQUEST_URL
      + '?appid=' + CLIENT_ID
      + '&query=' + query
      + '&output=' + output
      + '&ac=' + addressCode
      + '&image=' + needsImage;

    const headers = {
      'Content-Type': 'application/json',
    };

    const options = {
      headers: headers,
      method: 'GET'
    };

    const jsonResponse = await fetch(url, options);
    const jsonData = await jsonResponse.json();
    return jsonData;
  } catch (error) {
    throw new Error(error);
  }
};

deserialize = (json) => {
  const result = new Array();
  const data = JSON.parse(JSON.stringify(json));
  if (data.ResultInfo.Count > 0) {
    data.Feature.forEach(v => {
      const station = v.Property.Station ? v.Property.Station.map(value => {
        return {
          id: value.Id,
          subId: value.SubId,
          name: value.Name,
          railway: value.Railway,
          exit: value.Exit,
          time: value.Time
        };
      }) : '';
      const shop = {
        uid: v.Property.Uid,
        name: v.Name,
        genre: v.Property.Genre,
        address: v.Property.Address,
        image: v.Property.LeadImage,
        parking: v.Property.ParkingFlag,
        station: station,
        coupon: v.Property.SmartPhoneCouponFlag,
        tel: v.Property.Tel1
      };
      result.push(shop);
    });
    return result;
  }
};


module.exports = {
  localSearch,
  deserialize
};