import React, { useState } from 'react'
import { generateFunctionCode } from '../services/aiAgent'
import { functionRegistry } from '../utils/functionRegistry'
import { safeExec } from '../utils/safeExecution'
import AceEditor from 'react-ace'
import ReactDiffViewer from 'react-diff-viewer-continued'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'

const AIFunctionGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedFunction, setGeneratedFunction] = useState<string | null>(null)
  const [functionName, setFunctionName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedFunction, setEditedFunction] = useState('')

  const handleGenerate = async () => {
    setError(null)
    setGeneratedFunction(null)
    setIsEditing(false)
    try {
      const code = await generateFunctionCode(prompt)
      setGeneratedFunction(code)
      setEditedFunction(code)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedFunction && functionName) {
      try {
        // Use safeExec to evaluate the function in a safe context
        const func = safeExec(`return ${editedFunction}`)
        if (typeof func === 'function') {
          functionRegistry.register(functionName, func)
          setPrompt('')
          setGeneratedFunction(null)
          setFunctionName('')
          setIsEditing(false)
          setEditedFunction('')
        } else {
          throw new Error('Generated code did not return a valid function')
        }
      } catch (err) {
        setError((err as Error).message)
      }
    }
  }

  const handleReset = () => {
    if (generatedFunction) {
      setEditedFunction(generatedFunction)
    }
  }

  return (
    <div className="mb-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">AI Function Generator</h2>
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the function you want to generate..."
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Function
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {generatedFunction && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Generated Function:</h3>
          {isEditing ? (
            <>
              <AceEditor
                mode="javascript"
                theme="monokai"
                onChange={setEditedFunction}
                value={editedFunction}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                style={{ width: '100%', height: '300px' }}
              />
              <ReactDiffViewer
                oldValue={generatedFunction}
                newValue={editedFunction}
                splitView={true}
                leftTitle="Original"
                rightTitle="Edited"
              />
            </>
          ) : (
            <pre className="bg-gray-100 p-2 rounded mb-2">{generatedFunction}</pre>
          )}
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              placeholder="Function name"
              className="flex-grow p-2 border rounded"
            />
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Function
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIFunctionGenerator