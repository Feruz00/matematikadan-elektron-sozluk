import { Card, Space, Avatar, Menu , Typography, Tag, Button, message, Badge} from 'antd';
import {useRef, useEffect, useState} from 'react';
import {UserOutlined, CalendarOutlined,BarChartOutlined, SettingOutlined,MessageOutlined} from '@ant-design/icons'
import {Auth} from '../../context'
import config from '../../config'
import axios from 'axios'
import Users from '../users/Users';
import Me from '../settings/Me';
import Active from '../active/Active';
import Results from '../results/Results';
import Habarlar from '../messages/message';
import { LanguageOutlined } from '@mui/icons-material';
// import {} from ''
const error = () => {
    message.error('Something wrong went!');
};
const Home = () => {
    const {user} = Auth()
    const ref = useRef()
    const [current, setCurrent] = useState( 'active');
    const logout = async ()=>{
        try {
            
            await axios({
                method: "GET",
                url: `${config}/api/v1/auth/logout`,
                withCredentials: true
            })
            window.location.reload();
        } catch (error) {
            ref.current.click()    
        }

    }
    useEffect( ()=>{
        document.title='Admin sahypa | Matematikadan elektron sözlük'
        },[] )
    return (
        <div className='site-card'>
            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
            <Card title={ 
                <Space direction='horizontal'>
                    {/* {user.photo?.length > 0 ? 
                        <Avatar src={ `${config}/${user.photo}`} />:
                        <Avatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<UserOutlined/>}/>
                    } */}
                    <Typography.Title level={5}> {user.firstName} {user.lastName} {' '}
                    <Tag color={'#108ee9'}> #admin </Tag> </Typography.Title>
                    
                </Space>
            }
            style={{width: '90%', height: '100%'}}
            extra={ <Button onClick={logout} type='link'>Ulgamdan çyk</Button> }
            >
                <Menu mode='horizontal' selectedKeys={[current]} onClick={ e=>setCurrent(e.key) }>
                    
                    <Menu.Item key="active" icon={<LanguageOutlined />}>
                        Dünýä dilleri
                    </Menu.Item>
                    <Menu.Item key="results" icon={<CalendarOutlined />}>
                        Sözler
                    </Menu.Item>

                    {/* <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Sazlamalar
                    </Menu.Item>  */}
                   
                    
                </Menu>
                <br/>

                {
                    current === 'active' && <Active />
                }
                {
                    current === 'results' && <Results />
                }
    
                {/* {
                    current === 'users' && <Users user={user} />
                }
                {
                    current === 'settings' && <Me user={user} />
                }
                
                {
                    current === 'messages' && <Habarlar messages={messages} setMessages={setMessages} />
                } */}
            </Card>
        </div>
    );
}

export default Home;
