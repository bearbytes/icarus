import styled from 'styled-components'

export const HBox = styled.div`
  display: flex;
`

export const VBox = styled.div`
  display: flex;
  flex-direction: column;
`

export const Spacer = styled.div`
  flex: 1;
`

export const ExpandingHBox = styled(HBox)`
  flex: 1;
`

export const ExpandingVBox = styled(VBox)`
  flex: 1;
`

export const CenteredHBox = styled(HBox)`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const CenteredVBox = styled(VBox)`
  flex: 1;
  align-items: center;
  justify-content: center;
`
