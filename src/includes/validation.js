import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'

import {
  required,
  min,
  max,
  email,
  numeric,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
  alpha_spaces as alphaSpaces
} from '@vee-validate/rules'

export default {
  // Vue will run the install method of the plugins, befor it is mount
  // Thera are 2 arguments you can accept to the function (app, options)
  // app: is the Vue instance
  // options: is the aditional data options passed from the view instance to the plugin
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    // Define a rule [First argument is the name of the rule, Second: Function that will perform validation]
    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('numeric', numeric)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('password_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)
    defineRule('alpha_spaces', alphaSpaces)

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `The field ${context.field} is required`,
          min: `The field ${context.field} is too short`,
          alpha_spaces: `The field ${context.field} may only contain alphabetic characters and spaces`,
          max: `The field ${context.field} is too long`,
          email: `The field ${context.field} must be a valid email`,
          min_value: `The field ${context.field} is too low`,
          max_value: `The field ${context.field} is too high`,
          excluded: `You are not allowed to use this value for the field ${context.field}`,
          country_excluded: `Due to restrictions, we do not accept users from this location`,
          password_mismatch: `Password dont't match.`,
          numeric: `The field ${context.field} may only contain numeric characters`,
          tos: `You must accept the Terms of Services`
        }

        const message = messages[context.rule.name]
          ? messages[context.rule.name]
          : `The field ${context.field} is invalid`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  }
}
