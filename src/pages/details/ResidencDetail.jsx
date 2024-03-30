import React , { useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Page from '../../components/Page.jsx';
import Title from '../../components/Title.jsx';
import Navi from '../../components/Navi.jsx';
import naviDB from '../../json/navi.json';
import Detail from '../../components/Detail';
import ErrorDialog from '../../components/ErrorDialog.jsx';
import * as MyLayout from '../../lib/MyLayout.jsx';


const ResidenceDetails = () => {

  const params = useParams();
  const [ upDateLogin , setUpdateLogin] = useState(false);
  const [ dataContent, setDataContent ] = useState();
  const [ info , setInfo ] = useState();
  const [ expire , setExpire ] = useState();
  const [ administration , setAdministration ] = useState();
  const [ address , setAddress ] = useState();
  const [ etct, setEtct ] = useState();
  const { values , name } = params;
  const { startLoading, finishLoading } = MyLayout.useLoading();
  const { openDialog } = MyLayout.useDialog();
  
  const arry01 = { 
    title : [], 
    content : [], 
    expire :[], 
    administration : [], 
    address : [] , 
    etct : []};

    const changeCondition = async() => {

      try{
         const res = await axios.get('http://localhost:3400/LoginList');
         const data = res.data;

         if(data.length <= 0){
           return setUpdateLogin(false);
  
         }else{
           return setUpdateLogin(true), setDataContent([data[0].userId, data[0].userPassword]);
         }
  
     } catch(err){
          openDialog(<ErrorDialog />);
          return;
     }
      
   };

  const Api = async() => {
     startLoading('정보불러오는 중...');
     try{
     const res = await axios.post('http://localhost:3400/residenceApi' , name);
     const data = res.data.youthPolicyList.youthPolicy; 

     if(!data.length){
      
     const data_title = data.polyBizSjnm._cdata;
     const data_content = data.polyItcnCn._cdata;
     const data_expire = data.bizPrdCn._cdata;
     const data_administration = data.mngtMson._cdata;
     const data_address = data.rqutProcCn._cdata;
     const data_etct = data.etct._cdata;
   
     arry01.title.push(data_title);
     arry01.content.push(data_content);
     arry01.expire.push(data_expire);
     arry01.administration.push(data_administration);
     arry01.address.push(data_address);
     arry01.etct.push(data_etct);
 
     finishLoading();
     setInfo(arry01.content);
     setExpire(arry01.expire);
     setAdministration(arry01.administration);
     setAddress(arry01.address);
     setEtct(arry01.etct);
     
    }

    if(data.length > 0){

     for(let i in data){
       
        const data_title = data[i].polyBizSjnm._cdata;
        const data_content = data[i].polyItcnCn._cdata;
        const data_expire = data[i].bizPrdCn._cdata;
        const data_administration = data[i].mngtMson._cdata;
        const data_address = data[i].rqutProcCn._cdata;
        const data_etct = data[i].etct._cdata;
      
        arry01.title.push(data_title);
        arry01.content.push(data_content);
        arry01.expire.push(data_expire);
        arry01.administration.push(data_administration);
        arry01.address.push(data_address);
        arry01.etct.push(data_etct);


        if(arry01.title[i] == values){

          return finishLoading(),
          setInfo(arry01.content[i]),
          setExpire(arry01.expire[i]),
          setAdministration(arry01.administration[i]),
          setAddress(arry01.address[i]),
          setEtct(arry01.etct[i]);
        }

      }
    }

     }catch(err){
      finishLoading();
      openDialog(<ErrorDialog />);
     }
     finishLoading();
  };

  const onClick = async(e) => {

    const value = params.values;
    const name = params.name;
    const link = `/details/residence/${name}/${value}`;
    const letter = e;

    if(upDateLogin){

      try{
      const res = await axios.post('http://localhost:3400/MyList' , [dataContent[0], name, link, value]);
      const data = res.data;

      if(data == 'already'){
        return alert('이미 찜한 상품입니다');
      }else{
        letter.style.color = `#f00000`;

        return alert('찜에 성공했습니다.');
      }
     }catch(err){
      openDialog(<ErrorDialog />);
      return;
     }

    }else{

        return alert('로그인이후 이용가능합니다');
    }
    
 };

  useEffect(() => {
 
      changeCondition();
      Api();

  },[upDateLogin])

     return(
        <Page header={<Title title={'주거정책설명'}></Title>}
        footer={ upDateLogin ? (<Navi data={naviDB.Info}/>) : (<Navi data={naviDB.detail}/>)}>
      
          <Detail 
          title={ values }
          info={info}
          expire={expire}
          administration={administration}
          etct={etct}
          address={address}
          onClick={(e) => onClick(e.target)}
          >
            
          </Detail>
          
        </Page>
     )
}

export default ResidenceDetails;