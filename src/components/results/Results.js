import {useState, useRef, useEffect} from 'react';
import {Input, Typography, message, Button, Divider,  Table, Modal,  Tag, Select} from 'antd'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import config from '../../config'
const error = () => {
    message.error('Something wrong went!');
};
const success = () => {
    message.success('Üstünlikli tamamlandy');
};
const Results = () => {
    
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [text, setText] = useState('')
    const [short, setShort] = useState('')

    const ref = useRef()
    const sucessRef = useRef()
      
    const [lang, setLang] = useState(["TM","RU","EN"]);
    const [loadLang, setLoadLang] = useState(false)
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
            setIsModalVisible(false)
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
                setIsModalVisible(false)
            })
            setLoading(false)            
        }
        fetData()
    }, [text, short] )

    async function handleOk() {
        // console.log(words);
        await axios.post(`${config}/api/v1/word/add`,{
            word:words
        }, {withCredentials: true}).catch(()=>{
            ref.current.click();
        }).then(()=>{
            sucessRef.current.click()
        })
        getData();
        setWords({
            EN:'',
            TM:'',
            RU:''
        })
        setIsModalVisible(false);
        
    }
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    
 
    

    return (
        <div style={{width:'100%', paddingLeft: '2rem'}}>
        
        <Button style={{display: 'none'}} ref={ref} onClick={error} />
        <Button type='primary' onClick={success} ref={sucessRef} style={{display: 'none'}}>Bas</Button>        
    
            <div style={{width:'100%', display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', width:'100%'}}>
                    <Button onClick={()=>setIsModalVisible(true)}>
                    <Typography.Title level={5}> Täze söz giriz {' '} </Typography.Title>
                    </Button>
                    
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
                    
                    {/* <Typography.Title level={5}>  {' '} </Typography.Title> */}
                    
                </div>
                
            </div>
            <br/>
            <Divider />
            <Table
                loading={loading}
                dataSource={data}
 
                pagination={{
                    pageSize: 50,
                    total: data.length
                }}
                onRow={(record, rowIndex)=>{
                    return {
                        onClick: event=>{
                            return navigate(`/admin/${record.key}`)
                        }
                    }
                }}
            >
                <Table.Column title="Türkmençe" dataIndex="TM"  />
                <Table.Column title="Русский" dataIndex="RU"  />
                <Table.Column title="English" dataIndex="EN"  />
                
            </Table>

            
             <Modal title="Täze söz goş" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {
                    <div style={{display:'flex', justifyContent:'center', flexDirection: 'column', gap: '1rem', width: '100%'}}>
                        {
                            lang.map( i=><div key={i} style={{width: '100%', gap:'1rem', display: 'flex'}}>
                                <Input 
                                    style={{flex: '1'}}
                                    name={i}
                                    onChange = { (e)=> setWords(prev=>({...prev, [e.target.name]:e.target.value })) }
                                />
                                <Tag style={{display:'flex', justifyContent:'center', alignItems: 'center'}}>{i}</Tag>
                            </div> )
                        }
                    </div>

                }
                
            </Modal>
        </div>
    );
}

export default Results;
