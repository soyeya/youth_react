const axios = require('axios');
const convert = require('xml-js');
const selectDB = require('../json/select.json');

const news_api = async(values) => {

    const key = `5955966ac3d2620c621d1718`;
    const work = `023010`;
    const residence = `023020`;
    const welfare = `023040`;
    const education = `023030`;
    const value = Object.keys(values);

     try{

        const res = await axios.get(encodeURI(`https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${key}&pageIndex=1&display=6&srchPolyBizSecd=003002001&bizTycdSel=${work},${residence},${welfare},${education}`));
        const data = convert.xml2json(res.data,{
            compact: true, // Compact JSON으로 받기
            spaces: 4, // XML 결과물 들여쓰기에 사용할 공백 수
        });

        return data;
     }
    catch(error){
        return error;
     }

}


    const job_api = async(values) => {

    const key = `5955966ac3d2620c621d1718`;
    const work = `023010`;
    const value = Object.keys(values);

     try{
        for(let v of selectDB.region){
            if(value == v.name){
                const res = await axios.get(encodeURI(`https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${key}&pageIndex=1&display=10&srchPolyBizSecd=${v.code}&bizTycdSel=${work}`));
                const data = convert.xml2json(res.data,{
                    compact: true, // Compact JSON으로 받기
                    spaces: 4, // XML 결과물 들여쓰기에 사용할 공백 수
                });
                return data;
        }else { return '검색결과없음'}
     }
    }
    catch(error){
        return error;
     }

}

const residence_api = async(values) => {

    const key = `5955966ac3d2620c621d1718`;
    const residence = `023020`;
    const value = Object.keys(values);

     try{
        for(let v of selectDB.region){
            if(value == v.name){
                const res = await axios.get(encodeURI(`https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${key}&pageIndex=1&display=10&srchPolyBizSecd=${v.code}&bizTycdSel=${residence}`));
                const data = convert.xml2json(res.data,{
                    compact: true, // Compact JSON으로 받기
                    spaces: 4, // XML 결과물 들여쓰기에 사용할 공백 수
                });
                return data;
        }else { return '검색결과없음'}
     }
    }
    catch(error){
        return error;
     }

}

const welfare_api = async(values) => {

    const key = `5955966ac3d2620c621d1718`;
    const welfare = `023040`;
    const value = Object.keys(values);

     try{
        for(let v of selectDB.region){
            if(value == v.name){
                const res = await axios.get(encodeURI(`https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${key}&pageIndex=1&display=10&srchPolyBizSecd=${v.code}&bizTycdSel=${welfare}`));
                const data = convert.xml2json(res.data,{
                    compact: true, // Compact JSON으로 받기
                    spaces: 4, // XML 결과물 들여쓰기에 사용할 공백 수
                });
                return data;
        }else { return '검색결과없음'}
     }
    }
    catch(error){
        return error;
     }

}


const education_api = async(values) => {

    const key = `5955966ac3d2620c621d1718`;
    const education = `023030`;
    const value = Object.keys(values);

     try{
        for(let v of selectDB.region){
            if(value == v.name){
                const res = await axios.get(encodeURI(`https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${key}&pageIndex=1&display=10&srchPolyBizSecd=${v.code}&bizTycdSel=${education}`));
                const data = convert.xml2json(res.data,{
                    compact: true, // Compact JSON으로 받기
                    spaces: 4, // XML 결과물 들여쓰기에 사용할 공백 수
                });
                return data;
        }else { return '검색결과없음'}
     }
    }
    catch(error){
        return error;
     }

}

const finance_api = async(values) => {

      const key = `916c5dc9c4437bedd9264a7b767aab71`;
      const value = Object.keys(values);

      try{
        for(let v of selectDB.bank){
            if(value == v.name){
                console.log(value);
                const res = await axios.get(`http://finlife.fss.or.kr/finlifeapi/${v.code}.json?auth=${key}&topFinGrpNo=${v.section}&pageNo=1`);
                const data = res.data.result;
              
                return data;
            }
        }
      }catch(error){
        return error;
      }
      
}

const database = {
   
    news_api,
    job_api,
    residence_api,
    welfare_api,
    education_api,
    finance_api
}

module.exports = { database }






