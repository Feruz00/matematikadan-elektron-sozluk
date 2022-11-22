import {useEffect, useRef, useState, useMemo} from 'react';

import {Button, List, Typography, Modal,Input, Select, message, Table, Space} from 'antd'
import calculateTime from '../../calculateTime';
import axios from 'axios';
import config from '../../config'
const error = () => {
    message.error('Uldamda näsazlyk ýüze çykdy. Täzeden synanyşyň!');
};
const success = () => {
    message.success('Üstünlikli tamamlandy');
};
const Active = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const ref = useRef()
    const sucessRef = useRef()
    
    const [short, setShort] = useState('')
    const [long, setLong] = useState('')
    

    const getData = async ( )=>{
        setLoading(true)
    
        await axios.get(`${config}/api/v1/lang/all`)
            .then(res=>{

                setData(res.data.map(i=> ({...i, key:i._id})))
            }).catch(()=>{
                ref.current.click()
            })
        setLoading(false)
    
    }
    
    useEffect( ()=>{
        getData()
    }, [])

    async function handleOk() {
        
        await axios.post(`${config}/api/v1/lang/add`,{
            short, long
        }, {withCredentials: true}).catch(()=>{
            ref.current.click();
        }).then(()=>{
            sucessRef.current.click()
        })
        getData();
        setIsModalVisible(false);
        
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const deleteItems = async ()=>{
        await axios.post(`${config}/api/v1/lang/`, {
            selectedRowKeys
        },{
            withCredentials: true
        }).then( ()=>{
            getData()
        } ).catch((err)=>{
            console.log(err);
            ref.current.click()
        })
        setSelectedRowKeys([]);
    }
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    
    return (
        <div style={{width:'90%', paddingLeft: '2rem'}}>
        <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
        <Button type='primary' onClick={success} ref={sucessRef} style={{display: 'none'}}>Bas</Button>        
            
            {/* <div style={{width:'100%', display: 'flex', justifyContent: "space-between", marginBottom:'.5rem'}}>
                <Space dir="horizontal">
                    {selectedRowKeys.length > 0 && `${selectedRowKeys.length} saýlandy.`}
                    <Button disabled={selectedRowKeys.length === 0} onClick={deleteItems}>Ýok et.</Button>
                </Space>
                <Button type="primary"
                onClick={()=>setIsModalVisible(true)}
                >Täze dil goş</Button>
            </div> */}
            <Table
                loading={loading}
                dataSource={data}
                // rowSelection={rowSelection}
                pagination={false}
            >
                <Table.Column title="Gysga ady" dataIndex="short"  />
                <Table.Column title="Doly ady" dataIndex="long"  />
            </Table>


            <Modal title="Täze dil goş" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input 
                    maxLength={50}
                    showCount
                    placeholder='Gysga görnüşi'
                    value={short}
                    onChange={ (e)=>setShort(e.target.value) }
                />
                <br/>
                <br/>

                <Input 
                    maxLength={30}
                    showCount
                    placeholder='Doly görnüşde'
                    value={long}
                    onChange={ (e)=>setLong(e.target.value) }
                />
                <br/>
                
            </Modal>
        </div>
    );
}

export default Active;
