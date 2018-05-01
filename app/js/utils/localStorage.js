let lastLocalStorageError = {}

export function saveAppStateToLocalStorage(state) {
  try {
    const {
      mapView,
      features,
      filters,
      activeFilters,
    } = state

    // TODO skip if unchanged
    const data = {
      features,
      filters,
      activeFilters,
    }
    window.localStorage.setItem('CivMap.data', JSON.stringify(data))

    const view = {
      mapView,
    }
    window.localStorage.setItem('CivMap.view', JSON.stringify(view))

  } catch (e) {
    if (lastLocalStorageError.code != e.code) {
      lastLocalStorageError = e
      console.error('Failed storing app state in LocalStorage:', e)
    }
  }
}

export function getAppStateFromLocalStorage() {
  try {
    let appState = {}

    const dataJson = window.localStorage.getItem('CivMap.data')
    if (dataJson) {
      appState = { ...appState, ...JSON.parse(dataJson) }
    }

    const viewJson = window.localStorage.getItem('CivMap.view')
    if (viewJson) {
      appState = { ...appState, ...JSON.parse(viewJson) }
    }

    return appState

  } catch (e) {
    console.error('Loading from localStorage failed', e)
  }
}
