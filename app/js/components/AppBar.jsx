import React from 'react'
import { connect } from 'react-redux'

import { IconButton } from '@mui/material'
import { Close, Edit, Layers, Menu, Search, Share } from '@mui/icons-material'

import CreateFeatureMenuButton from './edit/CreateFeatureMenuButton'
import { openBrowseMode, openEditMode, openLayers, openSearch, setDrawerOpen, lookupFeature } from '../store'

const AppBar = ({
  collection,
  appMode,
  feature,
  searchQuery,
  viewport,
  dispatch,
}) => {
  return <div className='appbar'>
    <IconButton onClick={() => dispatch(setDrawerOpen())}>
      <Menu />
    </IconButton>

    {appMode === 'LAYERS' ||
      <IconButton onClick={() => dispatch(openLayers())}>
        <Layers />
      </IconButton>
    }

    {appMode === 'SEARCH' ||
      <IconButton onClick={() => {
        // TODO search close/similar to active feature
        dispatch(openSearch())
      }}>
        <Search />
      </IconButton>
    }

    <IconButton onClick={() => {
      if (appMode === 'FEATURE' && feature && collection && collection.source) {
        const name = encodeURIComponent(feature.name || '')//.replace('%20', '_')
        location.hash = `#q=${name}#f=${encodeURIComponent(feature.id)}#url=${encodeURIComponent(collection.source)}`
      } else if (appMode === 'SEARCH' && searchQuery) {
        location.hash = `#q=${encodeURIComponent(searchQuery)}`
      } else {
        const { x, z, radius } = viewport
        location.hash = `c=${x},${z},r${radius}`
        // TODO better location sharing: create marker with name prompt, add query for close-by features, etc.
      }
    }}>
      <Share />
    </IconButton>

    {appMode === 'FEATURE' ?
      <IconButton onClick={() => {
        dispatch(openEditMode(feature.id, feature.collectionId))
      }}>
        <Edit />
      </IconButton>
      :
      <CreateFeatureMenuButton dispatch={dispatch} />
    }

    <div className='appbar-stretch'>
      {/* CivMap */}
    </div>

    {appMode !== 'BROWSE' &&
      <IconButton onClick={() => dispatch(openBrowseMode())}>
        <Close />
      </IconButton>
    }
  </div>
}

const mapStateToProps = (state) => {
  const { collections, control, mapView } = state
  const { activeFeatureCollection, activeFeatureId, appMode, searchQuery } = control
  return {
    appMode: appMode,
    collection: collections[activeFeatureCollection],
    feature: lookupFeature(state, activeFeatureId, activeFeatureCollection),
    searchQuery: searchQuery,
    viewport: mapView.viewport,
  }
}

export default connect(mapStateToProps)(AppBar)
