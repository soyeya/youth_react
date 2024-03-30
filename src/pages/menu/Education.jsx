import React , { useState, useEffect } from 'react';
import axios from 'axios';
import Info from '../../components/Info';
import Page from '../../components/Page';
import Title from '../../components/Title';
import Navi from '../../components/Navi';
import NaviDB from '../../json/navi.json';
import selectDB from '../../json/select.json';
import * as MyLayout from '../../lib/MyLayout';
import ErrorDialog from '../../components/ErrorDialog';

const Eductaion = () => {

    const [ upDateLogin , setUpdateLogin] = useState(false);
    const [ dataContent, setDataContent ] = useState();
    const [data, setData] = useState(false);
    const [content, setContent] = useState(false);
    const [href , setHref] = useState('');
    const { startLoading , finishLoading } = MyLayout.useLoading();
    const { openDialog } = MyLayout.useDialog();
    let arryContent01 = [];
    let arryContent02 = [];
    
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

    const onClick = async(value) => {
          const values = value;
          if(!data){
             setData(['']);
             setContent(['지역명을 선택해주세요'])
             setHref('');
          }
          if(values){
              startLoading(`${values} 검색중...`)
              try{
                    const res = await axios.post('http://localhost:3400/educationApi', values);
                    const res_data = res.data.youthPolicyList.youthPolicy;
                    if(!res_data.length){
                      const result01 = [res_data.polyBizSjnm._cdata];
                      const result02 = [res_data.polyItcnCn._cdata];
                      arryContent01.push(result01);
                      arryContent02.push(result02);
                      return finishLoading(), setData(arryContent01), setContent(arryContent02), setHref(`/details/education/${values}`);
                
                    }

                    if(res_data.length > 0){
                      for(let i in res_data){
                          const result01 = [res_data[i].polyBizSjnm._cdata];
                          const result02 = [res_data[i].polyItcnCn._cdata];
                          arryContent01.push(result01);
                          arryContent02.push(result02);

                      }
                      return finishLoading(), setData(arryContent01), setContent(arryContent02), setHref(`/details/education/${values}`);
                    }
                          } catch(err){
                            finishLoading();
                            arryContent01 = [];
                            arryContent02 = ['검색결과가 없습니다'];
                            setData(arryContent01);
                            setContent(arryContent02);
                            setHref('');
                            return;
                      }
                      finishLoading();
                    }};

          const LogoutBtn = async() => {

            if(!upDateLogin){
              return
            }else{
                try{
                  startLoading('로그아웃중...');
                  const res = await axios.post('http://localhost:3400/Logout' , dataContent);
                  const data = res.data;
                  return finishLoading(), setUpdateLogin(false);
                }
                catch(err){
                  finishLoading();
                  console.log('err');
                }
                finishLoading();
            
            }
          }
    

            useEffect(() => {
              changeCondition();
              onClick();
            },[data, content, upDateLogin])

    return(
     <Page header={<Title title={'교육'} backURL={'/'}/>}
     footer={ upDateLogin ? (<Navi loginUpload color onClick={LogoutBtn}/>) : (<Navi data={NaviDB.Info}></Navi>)}
     >
        <Info 
        id={'job'} 
        data={selectDB.region} 
        onChange={(e) => onClick(e.target.value)}
        list01={data}
        list02={content}
        name={href}
        />
     </Page>
    )
}

export default Eductaion;