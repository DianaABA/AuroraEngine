import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, Button, ScrollView } from 'react-native'
import { createEngine, loadScenesFromJsonStrict } from 'aurora-engine'

export default function App() {
  const [log, setLog] = useState('')
  const engine = createEngine({ autoEmit: true })

  useEffect(() => {
    const run = async () => {
      const json = JSON.stringify([{ id:'intro', steps:[ { type:'dialogue', char:'Guide', text:'Hello from Expo stub.' } ] }])
      const { scenes, errors } = loadScenesFromJsonStrict(json)
      if(errors.length) { setLog('Validation errors: '+JSON.stringify(errors)); return }
      engine.loadScenes(scenes)
      engine.start('intro')
      engine.on('vn:step', ({ step }) => {
        if(step?.type === 'dialogue') setLog(prev => prev + `\n${step.char||''} ${step.text}`)
      })
    }
    run()
  }, [])

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontWeight:'bold', fontSize:18 }}>AuroraEngine + Expo (stub)</Text>
      <Button title="Next" onPress={()=> engine.next()} />
      <ScrollView style={{ marginTop:12 }}>
        <Text>{log}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
