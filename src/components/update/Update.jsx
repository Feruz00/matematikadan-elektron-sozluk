import {useState, useRef, useEffect} from 'react';
import {Input,  message, Button, Divider,  Table, Select, Card,  Typography, Spin, Tag} from 'antd'
import axios from 'axios'
import config from '../../config'
import { useNavigate, useParams } from 'react-router-dom';
const error = () => {
    message.error('Something wrong went!');
};
const success = () => {
    message.success('Üstünlikli tamamlandy');
};
const Update = () => {
    
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    
    const ref = useRef()
    const sucessRef = useRef()

    const { id } = useParams();
      console.log(id);
    const getData = async ()=>{
        setLoading(true)
        await axios({
            method:"GET",
            url:`${config}/api/v1/word/getOne`,
            params: {
                key: id
            },
            withCredentials: true
        })
        .then(res=>{
            setData(res.data.word)
        }).catch(()=>{
            ref.current.click()
        })
        setLoading(false)
    }
    useEffect( ()=>{
        getData()
    },[] )
    const navigate = useNavigate()
    
    const update = async ()=>{
        await axios({
            method:"PUT",
            url:`${config}/api/v1/word/update`,
            data:{
                key: id,
                word:data
            },
            withCredentials: true
        })
        .then(res=>{
            sucessRef.current.click()
            // setTimeout( ()=>{
            //     navigate('/admin')
            // }, 3000 )
        }).catch(()=>{
            ref.current.click()
        })
    }

    const deleteItem = async ()=>{
        await axios({
            method:"POST",
            url:`${config}/api/v1/word/delete`,
            data:{
                key: id,
                // word:data
            },
            withCredentials: true
        })
        .then(res=>{
            sucessRef.current.click()
            setTimeout( ()=>{
                navigate('/admin')
            }, 3000 )
        }).catch(()=>{
            ref.current.click()
        })
    }
    return (
        <div className='site-card'>
            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
            <Card title={ 
                    <Typography.Title level={5}> Matematikadan elektron sözlük </Typography.Title>
                
            }
            style={{width: '90%', height: '100%'}} 
            extra={
             <Typography.Link href="/admin">Admin sahypa geç</Typography.Link>
            }
            >
                <Button style={{display: 'none'}} ref={ref} onClick={error} />
                <Button type='primary' onClick={success} ref={sucessRef} style={{display: 'none'}}>Bas</Button>        
                {
                    loading ? <div className='update_main'>
                        <Spin size='large'/>
                    </div>:
                    <div className='update_word'>
                        <div className='update_soz'>
                            <Input 
                                value={data.TM}
                                onChange={ e=>setData(prev=> ({ ...data, TM:e.target.value })) }
                            />
                            <Tag>TM</Tag>
                        </div>
                        <div  className='update_soz'>
                            <Input 
                                value={data.RU}
                                onChange={ e=>setData(prev=> ({ ...data, RU:e.target.value })) }
                            />
                            <Tag>RU</Tag>
                        </div>
                        <div  className='update_soz'>
                            <Input 
                                value={data.EN}
                                onChange={ e=>setData(prev=> ({ ...data, EN:e.target.value })) }
                            />
                            <Tag>EN</Tag>
                        </div>
                        <div className='update_soz'>
                            <Button type='primary' onClick={()=>update()}>
                                Maglumatlary täzele
                            </Button>
                            
                            <Button onClick={()=>deleteItem()}>
                                Sözi poz
                            </Button>
                            
                        </div>
                    </div>
                }
                
            </Card>
        </div>
    );
    
}

export default Update;
