import React from 'react'

interface IProps {
  score: number
}

const scoreColors = [
  [230, 26, 11], // 0+
  [230, 77, 11], // 10+
  [196, 103, 22], // 20+
  [209, 155, 17], // 30+
  [201, 171, 36], // 40+
  [232, 192, 16], // 50+
  [215, 237, 175], // 60+
  [140, 173, 80], // 70+
  [52, 145, 79], // 80+
  [45, 117, 66] // 90+
]
const AssignmentBar = ({ score }: IProps) => {
  const decimal = Math.floor(score / 10) - 1
  const mod = (score % 10) + 1
  const opacity = 1 - mod / 10

  const backgroundColor = `rgba(${scoreColors[decimal]}, ${opacity})`

  return (
    <div className="score-bar">
      <div className="score-percent" style={{ backgroundColor, width: `${score}%` }}></div>
      <div className={`score-num ${score === 0 ? 'score-num-zero' : ''}`}>{score}</div>
    </div>
  )
}

export default AssignmentBar
