import {useState, useRef, useEffect} from 'react';
import {Input,  message, Button, Divider,  Table, Select, Card, Space, Typography} from 'antd'
import axios from 'axios'
import config from '../../config'
const error = () => {
    message.error('Something wrong went!');
};
const success = () => {
    message.success('Üstünlikli tamamlandy');
};
const Main = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [text, setText] = useState('')
    const [short, setShort] = useState('')

    const ref = useRef()
    const sucessRef = useRef()
      
    const [words, setWords] = useState({
        EN:'',
        TM:'',
        RU:''
    })
    const getData = async ()=>{
        setLoading(true)
        await axios({
            method:"GET",
            url:`${config}/api/v1/word/`,
            params: {
                text: "",
                short: ""
            },
            withCredentials: true
        })
        .then(res=>{
            setData(res.data.map(i=>({
                key: i._id,
                ...i.word
            })))
        }).catch(()=>{
            ref.current.click()
        })
        setLoading(false)
    }
    
    useEffect( ()=>{
        getData()
    },[] )

    useEffect( ()=>{
        if(text.length ===0) {
            getData()
            return
        }
        let cancel;
        const fetData =async ()=>{
           
            cancel && cancel()
            const CancelToken = axios.CancelToken;
           
            setLoading(true)
           
            await axios({
                method:"GET",
                url:`${config}/api/v1/word/`,
                params: {
                    text: text,
                    short: short.length === 0 ? 'TM': short
                },
                withCredentials: true,
                cancelToken: new CancelToken(canceler => {
                    cancel = canceler;
                })
            })
            .then(res=>{
                console.log(res.data);
                setData(res.data.map(i=>({
                    key: i._id,
                    ...i.word
                })))
            }).catch(()=>{
                ref.current.click()
            })
            setLoading(false)            
        }
        fetData()
    }, [text, short] )

    return (
        <div className='site-card'>
            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
            <Card title={ 
                    <Typography.Title level={5}> Matematikadan elektron sözlük </Typography.Title>
                
            }
            style={{width: '90%', height: '100%'}} 
            extra={
                <Typography.Link href="/login" >Içeri gir</Typography.Link>
            }
            >
        <Button style={{display: 'none'}} ref={ref} onClick={error} />
        <Button type='primary' onClick={success} ref={sucessRef} style={{display: 'none'}}>Bas</Button>        
    
            <div style={{width:'100%', display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', width:'100%'}}>
                    
                    <div style={{display:'flex', flexDirection: 'row', gap:'1rem', flex:'1', justifyContent:'flex-end'}}>
                        <Input
                            style={{marginLeft: '3rem', width:'40%'}}
                            placeholder='Söz gözle'
                            onChange={e=>setText(e.target.value)}
                        />
                        <Select
                            defaultValue="TM"
                            style={{
                                width: 120,
                            }}
                            onChange={(val)=>setShort(val)}
                            options={[
                                {
                                    value: 'TM',
                                    label: 'TM',
                                },
                                {
                                    value: 'EN',
                                    label: 'EN',
                                },
                                
                                {
                                    value: 'RU',
                                    label: 'RU',
                                },
                                
                                
                            ]}
                        />

                    </div>
                    
                    
                </div>
                
            </div>
            <br/>
            <Divider />
            <Table
                loading={loading}
                dataSource={data}
                // rowSelection={rowSelection}
                pagination={{
                    pageSize: 50,
                    total: data.length
                }}
            >
                <Table.Column title="Türkmençe" dataIndex="TM"  />
                <Table.Column title="Русский" dataIndex="RU"  />
                <Table.Column title="English" dataIndex="EN"  />
                
            </Table>

    
            </Card>
        </div>
    );
    
}

export default Main;
