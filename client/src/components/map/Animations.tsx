import React from 'react'
import styled, { keyframes } from 'styled-components'
import { withClientState } from '../hoc/withClientState'
import { DamageAnimation, MissAnimation } from '../../animations'
import { IAnimation } from '../../models'
import CenterOnTile from '../helper/CenterOnTile'

export default function Animations() {
  return withClientState(
    s => ({
      animations: s.ui.animations,
    }),
    s => {
      return (
        <g>
          {s.animations.map(animation => (
            <Animation key={animation.id} animation={animation} />
          ))}
        </g>
      )
    },
  )
}

function Animation(props: { animation: IAnimation }) {
  // Don't play animations older than 0.5 seconds
  const now = new Date().getTime()
  if (now - props.animation.startTime > 500) return null

  switch (props.animation.data.type) {
    case 'DamageAnimation':
      return <DamageAnimation data={props.animation.data} />
    case 'MissAnimation':
      return <MissAnimation data={props.animation.data} />
  }
}

function DamageAnimation(props: { data: DamageAnimation }) {
  return (
    <CenterOnTile tileId={props.data.tileId}>
      <GoingUp>
        <text
          transform={'scale(0.04)'}
          textAnchor={'middle'}
          fill={'red'}
          stroke={'black'}
          strokeWidth={0.5}
        >
          -{props.data.damage} hp
        </text>
      </GoingUp>
    </CenterOnTile>
  )
}

function MissAnimation(props: { data: MissAnimation }) {
  return (
    <CenterOnTile tileId={props.data.tileId}>
      <GoingUp>
        <text
          transform={'scale(0.04)'}
          textAnchor={'middle'}
          fill={'blue'}
          stroke={'black'}
          strokeWidth={0.5}
        >
          miss
        </text>
      </GoingUp>
    </CenterOnTile>
  )
}

const GoingUpAnimation = keyframes`
  from {
    transform: translateY(0px);
    opacity: 1;
  }

  to {
    transform: translateY(-1.5px);
    opacity: 0;
  }
`

const GoingUp = styled.g`
  animation: ${GoingUpAnimation} 1s linear forwards;
`
