export const showLoader = () => {
    document.getElementById("loader").style.display = "block"
    document.getElementById("root").classList.add("filterCls")
}

export const hideLoader = () => {
    document.getElementById("loader").style.display = "none"
    document.getElementById("root").classList.remove("filterCls")
}