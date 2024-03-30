import React , { useState, useEffect} from 'react';
import axios from 'axios';
import Page from '../components/Page';
import Title from '../components/Title';
import Navi from '../components/Navi';
import NaviDB from '../json/navi.json';
import Category from './Category';
import Board from './Board';
import * as MyLayout from '../lib/MyLayout';
import ErrorDialog from '../components/ErrorDialog';
import loadingImg from '../assets/img/toyouth.png';
import OpenPage from '../components/OpenPage';
import logo from '../assets/img/toyouth.png';


const Home = () => {
  const [ upDateLogin , setUpdateLogin] = useState(false);
  const [ dataContent, setDataContent ] = useState();
  const [ dataList, setDataList ] = useState();
  const { startLoading , finishLoading } = MyLayout.useLoading();
  const { openDialog , closeDialog } = MyLayout.useDialog();
  
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

  const arry01 = [];
  const news = async() => {

      try{
          startLoading('NEWS 불러오는중...');
          const res = await axios.get('http://localhost:3400/newsApi');
          const res_data = res.data.youthPolicyList.youthPolicy;
          let section_Title = "";
          
          if(res_data.length > 0){
             for(let i in res_data){
                 const title = res_data[i].polyBizSjnm._cdata;
                 const administration = res_data[i].mngtMson._cdata;
                 const section = res_data[i].polyRlmCd._cdata;
                 if(section == "023010") { section_Title = "job"}
                 else if(section == "023020") { section_Title = "residence"}
                 else if(section == "023040") { section_Title = "welfare"}
                 else if(section == "023030") { section_Title = "education"}
                 else{}
                 arry01.push({ title, administration, section_Title});
             }
             return  finishLoading(), setDataList(arry01);
         }

      }catch(err){

        finishLoading(); 
        setDataList(arry01);
        return;
      }
      
  };

  const onClick = async() => {

    if(!upDateLogin){
      return
    }else{
        startLoading('로그아웃중...');
        try{
          const res = await axios.post('http://localhost:3400/Logout' , dataContent);
          const data = res.data;
          return  finishLoading(), setUpdateLogin(false);
        }
        catch(err){
          finishLoading();
          console.log('err');
        }
        finishLoading();
    
    }
  };

  useEffect(() => {
      
    const openEvt = () => {
      window.addEventListener("load" , () => {
        openDialog(<OpenPage><img src={loadingImg} /></OpenPage>)
        setTimeout(() => {
          closeDialog();
       },3000);
      })
    };
     openEvt();
     changeCondition();
     news();



  },[upDateLogin])

     return(
      
        <Page 
        header={<Title title={<img src={logo}/>} color/>}
        footer={
          upDateLogin ? (<Navi loginUpload color onClick={onClick}/>) : (<Navi data={NaviDB.home} color></Navi>)}>
        <Category />
        <Board boardList={dataList}/>
        </Page>
     )
   }

export default Home;