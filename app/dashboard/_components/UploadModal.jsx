"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/contexts/ThemeContext';
import { Icon } from '@iconify/react';
import axios from 'axios';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { onSuccessToastify, onFailureToastify } from '@/app/libs/notifications';
import {

    Select,
    SelectItem,
} from '@tremor/react';


const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const UploadForm = (props) => {
    const { theme } = useTheme();
    const [formValues, setFormValues] = useState({});
    const [isClearing, setIsClearing] = useState(false);
    const [medicineDropDownItem, setMedicineDropDownItem] = useState([])
    const [typeDropDownItem, setTypeDropDownItem] = useState([])
    const [type, setType] = useState('')

    const getMedicineItems = async () => {
        const response = await axios.get('/api/medicine/', {})
        console.log(response.data)
        setMedicineDropDownItem(response.data)
    }

    const getTypeItems = async () => {
        const response = await axios.get('/api/medicine_type/')
        console.log(response.data)
        setTypeDropDownItem(response.data)
    }

    useEffect(() => {
        getMedicineItems()
        getTypeItems()


    }, [])

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['code-block'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false
        }
    };
    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];

    const handleInputChange = (value, name) => {

        const formData = { ...formValues, [name]: value }
        if (name === 'medicine_id' && 'type_id' in formData) delete formData.type_id
        else if (name === 'type_id' && 'medicine_id' in formData) delete formData.medicine_id
        setFormValues(formData);
        console.log(formData)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formValues);

        const mappedObjects = props.formObj.map(item => ({ [item.name]: '' }));
        const mappedObjectKeys = mappedObjects.flatMap(obj => Object.keys(obj));

        const result = mappedObjectKeys.filter(key => formValues[key] === '' || formValues[key] === null || formValues[key] === undefined || formValues[key] === 0);

        if (props.onSubmit && result.length === 0 && JSON.stringify(formValues) !== "{}") {
            props.onSubmit(formValues);
            console.log(result.length);
        } else {
            onFailureToastify("Undefined Value");
        }
    };


    const clearContent = (e) => {
        e.preventDefault();
        const keys = Object.keys(formValues);
        const clearNextValue = (index) => {
            if (index < keys.length) {
                const key = keys[index];

                setFormValues((prevValues) => ({
                    ...prevValues,
                    [key]: '',
                }));

                setTimeout(() => {
                    clearNextValue(index + 1);
                }, 1);
            } else {
                setIsClearing(false);
            }
        };

        clearNextValue(0);

    };
    const actionButtons = [
        {
            name: "Upload",
            color: theme.primaryColor,
            function: handleSubmit
        },
        {
            name: "Clear",
            color: "#edb95e",
            function: clearContent
        },
        {
            name: "Close",
            color: "#e23636",
            function: props.closeModalFunction
        },
    ];

    return (
        <form className='flex flex-col gap-2'>
            {props.formObj.map((item, index) => (
                <div className='flex w-full flex-col gap-2' key={index}>

                    {['medicine_id', 'type_id'].includes(item.name) ? (
                        <Select placeholder={`Select ${String(item.name).split('_')[0] + ' name'}`} value={type} onValueChange={(value) => {
                            setType(value)
                            handleInputChange(value, item.name)

                        }}>
                            {
                                !props.isDisease && medicineDropDownItem ? medicineDropDownItem.map((itemChild, indexChild) => (
                                    <SelectItem
                                        name={item.name} key={indexChild}
                                        value={itemChild.medicine_id}
                                    >
                                        {itemChild.medicine_name}
                                    </SelectItem>
                                ))
                                    :
                                    typeDropDownItem && typeDropDownItem.map((itemChild, indexChild) => (
                                        <SelectItem
                                            name={item.name} key={indexChild}
                                            value={itemChild.type_id}
                                        >
                                            {itemChild.type_name}
                                        </SelectItem>
                                    ))
                            }
                        </Select>
                    ) :
                        ['description', 'symptom', 'medicine_usage'].includes(item.name) ? (
                            <div className='w-full mb-11'>
                                <QuillEditor
                                    id={index}
                                    className='h-[6.5rem] w-full editor block'
                                    defaultValue={''}
                                    value={formValues[item.name]}
                                    onChange={(value) => handleInputChange(value, item.name)}
                                    placeholder={item.placeholder}
                                    modules={quillModules}
                                    formats={quillFormats}
                                />
                            </div>

                        ) : (
                            <input
                                type="text"
                                className='w-full'
                                placeholder={item.placeholder}
                                name={item.name}
                                autoComplete='off'
                                value={formValues[item.name]}
                                onChange={(e) => handleInputChange(e.target.value, item.name)}
                            />
                        )}
                </div>
            ))}
            <div className='flex space-x-2'>
                {actionButtons.map((item, index) => (
                    <button
                        key={index}
                        className='px-4 py-2 rounded-md text-white'
                        onClick={(e) => item.function(e)}
                        style={{ backgroundColor: item.color, borderColor: item.color }}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </form>
    );
}

function UploadModal(props) {
    const [formSwicther, setFormSwitcher] = useState(0);
    const { theme } = useTheme();
    const medicineFormObj = [
        { name: 'medicine_name', placeholder: 'Medicine Name' },
        { name: 'type_id', placeholder: 'Medicine Type' }
    ];

    const diseaseFormObj = [
        { name: 'disease_name_th', placeholder: 'Disease Name Thai' },
        { name: 'disease_name_en', placeholder: 'Disease Name English' },
        { name: 'description', placeholder: 'Description' },
        { name: 'symptom', placeholder: 'Symptom' },
        { name: 'medicine_id', placeholder: 'Medicine ID' },
        { name: 'medicine_usage', placeholder: 'Medicine usage' }
    ];
    const formSwitcherHandler = () => {
        setFormSwitcher(!formSwicther);
    }
    const onMedicineFormSubmit = async (formData) => {
        console.log(formData);
        try {
            const response = await fetch('/api/upload/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                onSuccessToastify("Medicine form has been upload");
            } else {
                onFailureToastify("fail to upload the post");
            }
        } catch (error) {
            onFailureToastify(error.message);
        }
    };

    const onDiseaseFormSubmit = async (formData) => {
        console.log(formData);
        try {
            const response = await fetch('/api/upload/disease', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSuccessToastify("Disease form has been upload");
            } else {
                onFailureToastify("fail to upload the post");
            }
        } catch (error) {
            onFailureToastify(error.message);
        };
    };


    return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className='z-10 absolute top-0 left-0 h-full w-full bg-slate-500 flex items-center justify-center backdrop-blur-sm'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                className='w-[35%] bg-white h-fit rounded-md p-6 flex flex-col space-y-3' >
                <div className='text-2xl font-bold flex items-center justify-between' style={{ color: theme.primaryColor }}>
                    <span>{formSwicther ? "Medicine Form" : "Disease Form"}</span>
                    <button onClick={formSwitcherHandler}><Icon icon="eva:swap-outline" /></button>
                </div>
                <UploadForm
                    closeModalFunction={props.showUploadFunction}
                    formObj={formSwicther ? medicineFormObj : diseaseFormObj}
                    onSubmit={formSwicther ? onMedicineFormSubmit : onDiseaseFormSubmit}
                    isDisease={formSwicther ? true : false}
                />
            </motion.div>
        </div>
    )
}

export default UploadModal