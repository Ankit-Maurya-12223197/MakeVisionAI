import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { FormField, Loader } from '../components'
import { getRandomPrompt } from '../utils'
import * as dotenv from 'dotenv';

dotenv.config();

const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });

    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);


// From this function we send request to our server and response
    const generateImage = async () => {

        if (form.prompt) {
            try {
                setGeneratingImg(true);

                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/dalle/generate-image`, {
                    method: 'POST',
                    headers: {  "Content-Type": "application/json", },
                    body: JSON.stringify({ prompt: form.prompt }),
                });

            // In response an object come 
                const data = await response.json();
                
                
                if (data.imageUrl) {
                    setForm({ ...form, photo: `${data.imageUrl}` });
                } else {
                    console.error("No photo in response:", data);
                    alert("Image generation failed.");
                }
            }
            catch (error) {
                console.log("Error: ",error)
                alert("Error in your code");
            }finally{
                setGeneratingImg(false);
            }
        }
        else{
            alert("Please enter your prompt");
        }

    }

// when we click share button, it send form data in request to save in cloudinary and get response
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.prompt && form.photo){
            setLoading(true);

            try{
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/post`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                })

                await response.json();
                navigate('/');
            } catch(error){
                alert("Sharing problem: "+error);

            } finally{
                setLoading(false);
            }
        } else{
            alert("First generate your image then share it");
        }

    }

// It save name and promt in form 
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

// It generates random prompt from constants folder and set it as prompt value
    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt })
    }

    return (
        <section className='max-w-4xl mx-auto '>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Create imaginative and visually stunning images through Gemini AI and share with community group</p>
            </div>

            <form className='mt-12 max-w-3xl ' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        LabelName="Enter the Name:"
                        type="text"
                        name="name"
                        placeholder="The name that you want to share with photo"
                        value={form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        LabelName="Enter Your Prompt:"
                        type="text"
                        name="prompt"
                        placeholder="an astronaut lounging in a tropical resort in space, vaporwave"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

{/* This is for image box -> down */}
                    <div className='relative bg-gray-50 border border-gray-300 text-gray-900
                text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 
                h-64 flex justify-center items-center'>
                        {form.photo ? (
                            <img src={form.photo} alt={form.prompt} className='w-full h-full object-auto rounded-xl' />
                        ) : (
                            <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40 rounded-xl' />
                        )}

                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                                <Loader />
                            </div>
                        )}

                    </div>

                </div>
{/* Above */}

                <div className='mt-5 flex gap-5 '>
                    <button type='button' onClick={generateImage} className='text-white bg-green-700 font-medium
                rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                        {generatingImg ? "Generating..." : "Generate"}
                    </button>

                </div>
                

                <div className='mt-10'>
                    <p className='mt-2 text-[#666e75] text-[14px]'>
                        Once you have created the image you want, you can share it with others
                    </p>
                    <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm
                w-full sm:w-auto px-5 py-2.5 text-center'>
                        {loading ? "sharing..." : "share with others"}
                    </button>

                </div>

            </form>

        </section>
    )
}

export default CreatePost