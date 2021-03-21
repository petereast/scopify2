package scopify.work.backend.infrastructure

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import redis.clients.jedis.Jedis
import scopify.work.backend.model.IScopeRepository
import scopify.work.backend.model.ScopeSession

class NotFound(message: String? = "Entity not found!") : Exception(message)

class RedisDal : IScopeRepository {
    val jedis = Jedis(System.getenv("REDIS_URL") ?: "localhost")

    // Expire after 10 mins
    val expiry = 600

    private fun sessionKey(id: String) = "session:$id"

    private fun setExpiry(id: String) = jedis.expire(sessionKey(id), expiry)

    override fun getSession(id: String): ScopeSession? {

        val session = Gson().fromJson<ScopeSession>(jedis.get(sessionKey(id)) ?: return null)

        // Reset the expiry each time a session is fetched
        setExpiry(id)

        return session
    }

    override fun writeSession(session: ScopeSession) {
        val sessionJson = Gson().toJson(session)

        jedis.set(sessionKey(session.id), sessionJson)
        setExpiry(session.id)
    }
}
