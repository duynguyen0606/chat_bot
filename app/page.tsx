'use client'

import axios from "axios"
import { FormEvent, useState } from "react"
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

export default function Home() {
  const [value, setValue] = useState('')
  const [chatLog, setChatLog] = useState<Array<any>>([])
  const [loading, setIsLoading] = useState(false)
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    setChatLog(prev => [...prev, { role: 'user', content: value }])

    sendMessage(value)
    setValue('')
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />;

  const sendMessage = (message: string) => {
    const url = 'https://api.openai.com/v1/chat/completions'
    const headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_KEY}`
    }

    const fullChatLog = [...chatLog, { "role": "user", "content": message }]

    const data = {
      model: 'gpt-3.5-turbo',
      messages: fullChatLog
      // prompt: `You are a smart, experienced and casual technical support agency for an eccomerce web application company called Duy-Tom.
      // If the answer to the questiion is not in the docuent specified below:

      // Documentation:
      // Payment issues: One common problem that can occur when making a purchase 

      // `
    }

    setIsLoading(true)
    axios.post(url, data, { headers: headers })
      .then(response => {
        console.log(response)
        setChatLog(prev => [...prev, { role: response.data.choices[0].message.role, content: response.data.choices[0].message.content }])
        setIsLoading(false)
      }).catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }

  return (
    <div className='container mx-auto max-w-[700px]'>
      <div className='flex flex-col min-h-screen bg-gray-900'>
        <h1 className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl' >Chat bot GPT</h1>
        <div className='flex-grow p-6'>
          <div className='flex flex-col space-y-4'>
            {chatLog.map((message, index) => (
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={index}>
                <div className={`${message.role === 'user' ? 'bg-purple-500' : 'bg-gray-800'} rounded-lg p-4 text-white max-w-sm`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex-none p-6'>
          <div className="flex rounded-lg border border-gray-700 bg-transparent text-white hover:bg-purple-600">
            <input type='text' className='flex-grow px-4 py-2 bg-transparent text-white font-semibold focus:outline-none transition-colors duration-300' placeholder='Input some text' value={value} onChange={(e) => setValue(e.target.value)} />
            <button type='submit' className='bg-purple-500 rounded-lg px-4 py-2 text-white'>
              {loading ? <Spin indicator={antIcon} /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
