import {upperFirst, camelCase} from "lodash";

export default {
    install(app) {
        const baseComponents = import.meta.glob("../components/base/*.vue", {
            eager: true
        });

        /**
         * The import.meta.glob function returns an object where the keys are the paths of the imported components and the values are the modules that contain the components.
         * The code then iterates over the entries of the baseComponents object using the Object.entries method. For each entry, the code extracts the component name from the path using the _.upperFirst and _.camelCase methods from the Lodash library.
         * The purpose of this code is to dynamically import all Vue.js components that match a certain pattern and register them with the Vue.js application.
         * The last objec of the SPLIT() method will always be the file name
         * we use the pop(), to grab the last item 
         */
    
        Object.entries(baseComponents).forEach(([path, module]) => {
            const componentName = upperFirst(camelCase(
                    path
                    .split("/")
                    .pop()
                    .replace(/\.\w+$/, "")
                )
            );

            app.component(`Base${componentName}`, module.default || module);
        });


    }
}