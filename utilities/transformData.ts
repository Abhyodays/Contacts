import { Results } from "realm"
import { Person } from "../models/Person"

const transformData = (contacts: Results<Person>) => {
    return contacts.map((contact, index) => ({
        key: `${index}`,
        name: contact.name,
        phone: contact.phone,
        profile: contact.profile,
        _id: contact._id,
        landline: contact.landline
    })).sort((a, b) => a.name.localeCompare(b.name))
}

export default transformData;